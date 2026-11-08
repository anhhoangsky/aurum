import type { ShaderVariantKey } from './generated';

export {
  SHADER_VARIANTS,
  SHADER_VARIANT_KEYS,
  VERTEX_SOURCE,
} from './generated';
export type { ShaderVariantKey } from './generated';

/**
 * Pick a build-time variant from the current render features. The renderer
 * caches programs by this key and compiles only the variants a session needs.
 */
export function shaderVariantFor(
  linear: boolean,
  mask: boolean,
  liquify: boolean,
): ShaderVariantKey {
  if (linear) {
    if (mask) return liquify ? 'beauty-liquify' : 'beauty';
    return liquify ? 'base-linear-liquify' : 'base-linear';
  }
  if (mask) return liquify ? 'beauty-gamma-liquify' : 'beauty-gamma';
  return liquify ? 'base-liquify' : 'base';
}
