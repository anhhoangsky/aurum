// Demo Trusted Types policy for the standalone aurum harness. The only named
// policy the demo CSP allows is `mng-ui`; it accepts any same-origin URL
// (all aurum code is self-hosted) and passes HTML templates straight through
// for the engine's own chrome strings.
const POLICY_NAME = 'mng-ui';

function policy() {
  if (window.__mngTrustedTypesPolicy) return window.__mngTrustedTypesPolicy;
  if (!window.trustedTypes) return null;
  window.__mngTrustedTypesPolicy = window.trustedTypes.createPolicy(POLICY_NAME, {
    createHTML: (value) => value,
    createScriptURL(value) {
      const url = new URL(value, window.location.href);
      if (url.origin !== window.location.origin) {
        throw new TypeError('cross-origin script URL blocked');
      }
      return url.href;
    },
  });
  return window.__mngTrustedTypesPolicy;
}

export function trustedScriptUrl(value) {
  const active = policy();
  return active ? active.createScriptURL(value) : value;
}
