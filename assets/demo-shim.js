// Installs the Trusted Types policy plus the innerHTML / insertAdjacentHTML
// shims the aurum engine needs when the demo page is served under
// `require-trusted-types-for 'script'`. Engine templates are plain strings
// carrying no untrusted values (never user input), so the policy is a
// pass-through.
import { trustedScriptUrl } from './trusted-types.js';

if (window.trustedTypes && !window.__mngShims) {
  window.__mngShims = true;
  const policy = (() => {
    try {
      return window.trustedTypes.createPolicy('mng-ui', {
        createHTML: (value) => value,
        createScriptURL(value) {
          const url = new URL(value, window.location.href);
          if (url.origin !== window.location.origin) {
            throw new TypeError('cross-origin script URL blocked');
          }
          return url.href;
        },
      });
    } catch {
      return null;
    }
  })();

  if (policy) {
    window.__mngTrustedTypesPolicy = window.__mngTrustedTypesPolicy || policy;
    const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    if (descriptor && descriptor.set && descriptor.get) {
      try {
        Object.defineProperty(Element.prototype, 'innerHTML', {
          configurable: true,
          enumerable: descriptor.enumerable,
          get() {
            return descriptor.get.call(this);
          },
          set(value) {
            descriptor.set.call(this, typeof value === 'string' ? policy.createHTML(value) : value);
          },
        });
      } catch {
        // leave the first failure visible
      }
      const adjacent = Object.getOwnPropertyDescriptor(Element.prototype, 'insertAdjacentHTML');
      if (adjacent && typeof adjacent.value === 'function') {
        const original = adjacent.value;
        try {
          Object.defineProperty(Element.prototype, 'insertAdjacentHTML', {
            configurable: true,
            enumerable: adjacent.enumerable,
            writable: true,
            value(position, html) {
              const safe = typeof html === 'string' ? policy.createHTML(html) : html;
              return original.call(this, position, safe);
            },
          });
        } catch {
          // ignore
        }
      }
    }
  }

  // Re-export for callers that prefer a shared helper.
  window.__trustedScriptUrl = trustedScriptUrl;
}
