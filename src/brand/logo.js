import { SYMBOL, WORD_GES, WORD_GLOBAL_TRADE, WORD_WIDTH, GES_WIDTH } from './logo-paths.js';

const PALETTE = {
  light: { solid: '#FFFFFF', accent: '#2BA8FF', text: '#FFFFFF' }, // for dark backgrounds
  dark: { solid: '#0B1F3A', accent: '#2BA8FF', text: '#0B1F3A' }, // for light backgrounds
  mono: { solid: 'currentColor', accent: 'currentColor', text: 'currentColor' },
};

/**
 * Inline SVG logo.
 * @param {{variant?: 'light'|'dark'|'mono', layout?: 'horizontal'|'compact'|'symbol', className?: string, title?: string}} o
 */
export function logo({ variant = 'light', layout = 'horizontal', className = '', title = 'GES Global Trade' } = {}) {
  const c = PALETTE[variant];
  const width = layout === 'symbol' ? 64 : layout === 'compact' ? GES_WIDTH : WORD_WIDTH;
  const words =
    layout === 'symbol' ? '' :
    `<path fill="${c.text}" d="${WORD_GES}${layout === 'horizontal' ? WORD_GLOBAL_TRADE : ''}"/>`;
  return (
    `<svg class="logo logo--${layout} ${className}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 64" role="img" aria-label="${title}">` +
    `<path class="logo__solid" fill="${c.solid}" d="${SYMBOL.solid}"/>` +
    `<path class="logo__bridge" fill="${c.accent}" d="${SYMBOL.bridge}"/>` +
    `<path class="logo__node" fill="${c.accent}" d="${SYMBOL.node}"/>` +
    words +
    `</svg>`
  );
}
