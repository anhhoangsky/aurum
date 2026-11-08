/**
 * Quality-profile resolution from the existing client probe.
 *
 * Reuses `probeAIClient()` (src/ai/client.ts) — the same capability source the
 * Real-ESRGAN planner uses — so the AI Engine and the upscale pipeline agree
 * on what the device can do. Never throws.
 *
 * NOTE (Phase 2): the pinned BiRefNet Lite artifact has a FIXED 512x512
 * input (1024x1024 OOMs in every browser backend per the model card). The
 * `inputResolution` reported here is therefore advisory for that model —
 * planSegmentation() is always clamped to the adapter's native inputSize
 * (engine.ts). 768/1024 profiles require a different artifact (Phase 2
 * blocker, see docs/ai-engine/model-selection.md §A).
 */

import { probeAIClient } from '../ai/client';
import type { AIClientProfile } from '../ai/client';
import type { AIInputResolution, AIQuality } from './types';

export interface DeviceProfile {
  quality: AIQuality;
  inputResolution: AIInputResolution;
  backend: 'webgpu' | 'wasm';
  ios: boolean;
  mobile: boolean;
  memoryBudgetMB: number;
  maxInputPixels: number;
  reasons: readonly string[];
}

const IOS_CANVAS_LIMIT = 16_777_216;

function capsFor(
  quality: AIQuality,
  backend: 'webgpu' | 'wasm',
  ios: boolean,
  mobile: boolean,
): { inputResolution: AIInputResolution; memoryBudgetMB: number; maxInputPixels: number } {
  const inputResolution: AIInputResolution =
    quality === 'low' ? 512 : quality === 'medium' ? 768 : 1024;
  if (backend === 'webgpu') {
    if (ios) return { inputResolution, memoryBudgetMB: 192, maxInputPixels: 4_000_000 };
    if (mobile) return { inputResolution, memoryBudgetMB: 320, maxInputPixels: 6_000_000 };
    return { inputResolution, memoryBudgetMB: 768, maxInputPixels: 12_000_000 };
  }
  if (ios) return { inputResolution, memoryBudgetMB: 128, maxInputPixels: 1_000_000 };
  if (mobile) return { inputResolution, memoryBudgetMB: 192, maxInputPixels: 1_500_000 };
  return { inputResolution, memoryBudgetMB: 384, maxInputPixels: 4_000_000 };
}

/** Map a probed client + requested quality to execution caps. Never throws. */
export function resolveDeviceProfile(
  profile: AIClientProfile,
  requested?: AIQuality,
): DeviceProfile {
  let quality: AIQuality = requested ?? 'medium';
  // iOS + WASM is the tightest combination: never advertise professional
  // single-shot inference there; the planner will still validate fits.
  const reasons: string[] = [];
  if (quality === 'professional' && profile.backend === 'wasm' && profile.ios) {
    quality = 'high';
    reasons.push('ios-wasm-downgrade');
  }
  if (profile.saveData && quality === 'high') {
    quality = 'medium';
    reasons.push('save-data');
  }
  reasons.push(profile.backend === 'webgpu' ? 'webgpu' : 'wasm-fallback');
  if (profile.ios) reasons.push('ios');
  if (profile.mobile) reasons.push('mobile');

  const maxInputPixels = profile.ios
    ? Math.min(IOS_CANVAS_LIMIT, capsFor(quality, profile.backend, true, profile.mobile).maxInputPixels)
    : capsFor(quality, profile.backend, profile.ios, profile.mobile).maxInputPixels;
  const caps = capsFor(quality, profile.backend, profile.ios, profile.mobile);

  return {
    quality,
    inputResolution: caps.inputResolution,
    backend: profile.backend,
    ios: profile.ios,
    mobile: profile.mobile,
    memoryBudgetMB: caps.memoryBudgetMB,
    maxInputPixels,
    reasons,
  };
}

/** Probe the client and resolve the profile in one step. */
export async function probeDeviceProfile(requested?: AIQuality): Promise<DeviceProfile> {
  const client = await probeAIClient();
  return resolveDeviceProfile(client, requested);
}
