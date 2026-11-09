export type IconName =
  | 'close'
  | 'undo'
  | 'redo'
  | 'crop'
  | 'perspective'
  | 'tiltY'
  | 'tiltX'
  | 'adjust'
  | 'filter'
  | 'rotateLeft'
  | 'rotateRight'
  | 'flipH'
  | 'flipV'
  | 'image'
  | 'download'
  | 'save'
  | 'copy'
  | 'auto'
  | 'ai'
  | 'liquify'
  | 'reset'
  | 'check'
  | 'alert'
  | 'text'
  | 'bg'
  | 'bookmark'
  | 'trash'
  | 'plus'
  | 'duplicate';

const PATHS: Record<IconName, string> = {
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  undo: '<path d="M9 14 4.5 9.5 9 5"/><path d="M4.5 9.5H14a5.5 5.5 0 0 1 0 11H9.5"/>',
  redo: '<path d="M15 14l4.5-4.5L15 5"/><path d="M19.5 9.5H10a5.5 5.5 0 0 0 0 11h4.5"/>',
  crop:
    '<path d="M6 2.5v14A1.5 1.5 0 0 0 7.5 18h14"/><path d="M2.5 6h14A1.5 1.5 0 0 1 18 7.5v14"/>',
  perspective:
    '<path d="M5 5h14l-2.1 14H7.1L5 5Z"/><path d="M9.5 12h5M12 9.5v5"/>',
  // Double-headed arrows instead of the ↕/↔ glyphs: those fall back to a
  // cramped system font on iOS and look uneven next to the pill text.
  tiltY:
    '<path d="M12 3.4v17.2"/><path d="m8.2 7.2 3.8-3.8 3.8 3.8"/><path d="m8.2 16.8 3.8 3.8 3.8-3.8"/>',
  tiltX:
    '<path d="M3.4 12h17.2"/><path d="m7.2 8.2-3.8 3.8 3.8 3.8"/><path d="m16.8 8.2 3.8 3.8-3.8 3.8"/>',
  adjust:
    '<path d="M4 6h7M15 6h5M4 12h3M11 12h9M4 18h9M17 18h3"/><circle cx="13" cy="6" r="1.9"/><circle cx="9" cy="12" r="1.9"/><circle cx="15" cy="18" r="1.9"/>',
  filter:
    '<circle cx="9.2" cy="9.2" r="5.7"/><circle cx="14.8" cy="9.2" r="5.7"/><circle cx="12" cy="14.4" r="5.7"/>',
  rotateLeft:
    '<path d="M4.2 10.2a8 8 0 1 1 2.2 6.9"/><path d="M4 4.5v6h6"/>',
  rotateRight:
    '<path d="M19.8 10.2a8 8 0 1 0-2.2 6.9"/><path d="M20 4.5v6h-6"/>',
  flipH:
    '<path d="M12 3v18" stroke-dasharray="2 3"/><path d="M9 6 4 12l5 6V6Z"/><path d="M15 6l5 6-5 6V6Z"/>',
  flipV:
    '<path d="M3 12h18" stroke-dasharray="2 3"/><path d="M6 9l6-5 6 5H6Z"/><path d="M6 15l6 5 6-5H6Z"/>',
  image:
    '<rect x="3" y="3" width="18" height="18" rx="4.5"/><circle cx="8.6" cy="8.6" r="1.4"/><path d="m21 15-5-5L5 21"/>',
  download:
    '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v2.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V17"/>',
  save:
    '<path d="M5 3.5h11l3 3V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 3 19V5a1.5 1.5 0 0 1 1.5-1.5Z"/><path d="M7.5 3.5v6h8v-6"/><path d="M7.5 20.5v-6h9v6"/>',
  copy:
    '<rect x="8" y="8" width="12.5" height="12.5" rx="2.4"/><path d="M16 8V5.5A2.5 2.5 0 0 0 13.5 3h-8A2.5 2.5 0 0 0 3 5.5v8A2.5 2.5 0 0 0 5.5 16H8"/>',
  auto:
    '<path d="M12 3.2l1.55 4.25L17.8 9l-4.25 1.55L12 14.8l-1.55-4.25L6.2 9l4.25-1.55L12 3.2Z"/><path d="M18.4 14.4l.72 1.98 1.98.72-1.98.72-.72 1.98-.72-1.98-1.98-.72 1.98-.72.72-1.98Z"/><path d="M5.4 14.8l.55 1.5 1.5.55-1.5.55-.55 1.5-.55-1.5-1.5-.55 1.5-.55.55-1.5Z"/>',
  ai:
    '<path d="M12 2.8l2.05 5.15L19.2 10l-5.15 2.05L12 17.2l-2.05-5.15L4.8 10l5.15-2.05L12 2.8Z"/><path d="M18.6 15.4v3.2M17 17h3.2"/><path d="M5.4 4.2v2.4M4.2 5.4h2.4"/>',
  liquify:
    '<path d="M3.5 15.8c3.4-7.2 7.9 5.6 11.5-.9 1.4-2.5 3.3-3.1 5.5-1.8"/><path d="M3.5 9.6c3.4-7.2 7.9 5.6 11.5-.9 1.4-2.5 3.3-3.1 5.5-1.8"/>',
  reset:
    '<path d="M20 12a8 8 0 1 1-2.35-5.65"/><path d="M20 4.5V10h-5.5"/>',
  check: '<path d="m5 12 4.5 4.5L19 7"/>',
  alert:
    '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><circle cx="12" cy="16.5" r=".9" fill="currentColor" stroke="none"/>',
  text: '<path d="M5 6h14M12 6v13.2"/><path d="M9.5 19.2h5"/>',
  bg: '<path d="M12 12a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"/><path d="M6.5 19.2c.6-2.3 2.8-3.6 5.5-3.6s4.9 1.3 5.5 3.6"/>',
  bookmark:
    '<path d="M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v15l-6.5-4.2L5.5 20V5A1.5 1.5 0 0 1 7 3.5Z"/>',
  trash:
    '<path d="M4 6.5h16"/><path d="M9 6V4.8A1.3 1.3 0 0 1 10.3 3.5h3.4A1.3 1.3 0 0 1 15 4.8V6"/><path d="M6.5 6.5 7.3 19a1.6 1.6 0 0 0 1.6 1.5h6.2a1.6 1.6 0 0 0 1.6-1.5l.8-12.5"/><path d="M10 10.5v6M14 10.5v6"/>',
  plus: '<path d="M12 5.5v13M5.5 12h13"/>',
  duplicate:
    '<rect x="8.5" y="8.5" width="12" height="12" rx="2.3"/><path d="M15.5 8.5v-3A2.5 2.5 0 0 0 13 3H6a2.5 2.5 0 0 0-2.5 2.5v7A2.5 2.5 0 0 0 6 15h2.5"/>',
};

/** Compact inline icon, sized by CSS (`currentColor` for theming). */
export function icon(name: IconName): string {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[name]}</svg>`;
}
