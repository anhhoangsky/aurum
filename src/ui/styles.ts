import css from './styles.css';

/**
 * The default stylesheet is imported as text and injected once at runtime, so
 * the library works with a single script tag. It is also shipped as
 * `dist/aurum.css` for apps that prefer a <link> (set `injectStyles: false`).
 */
export const UI_CSS: string = css;

let injected = false;

export function ensureStyles(): void {
  if (injected || typeof document === 'undefined') return;
  if (document.querySelector('style[data-aurum],link[data-aurum]')) {
    injected = true;
    return;
  }
  const style = document.createElement('style');
  style.setAttribute('data-aurum', '');
  style.textContent = UI_CSS;
  document.head.appendChild(style);
  injected = true;
}
