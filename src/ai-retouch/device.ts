import { probeAIClient } from '../ai/client';
import type { AIClientProfile } from '../ai/client';

export interface DeviceProfile {
  quality: string;
  backend: 'webgpu' | 'wasm';
  ios: boolean;
  mobile: boolean;
  memoryBudgetMB: number;
  maxInputPixels: number;
  reasons: readonly string[];
}

const IOS_CANVAS_LIMIT = 16_777_216;

function caps(backend: 'webgpu' | 'wasm', ios: boolean, mobile: boolean) {
  if (backend === 'webgpu') {
    if (ios) return { memoryBudgetMB: 512, maxInputPixels: 4_000_000 };
    if (mobile) return { memoryBudgetMB: 512, maxInputPixels: 6_000_000 };
    return { memoryBudgetMB: 768, maxInputPixels: 12_000_000 };
  }
  if (ios) return { memoryBudgetMB: 384, maxInputPixels: 1_000_000 };
  if (mobile) return { memoryBudgetMB: 192, maxInputPixels: 1_500_000 };
  return { memoryBudgetMB: 384, maxInputPixels: 4_000_000 };
}

export function resolveDeviceProfile(profile: AIClientProfile): DeviceProfile {
  const c = caps(profile.backend, profile.ios, profile.mobile);
  const reasons: string[] = [profile.backend === 'webgpu' ? 'webgpu' : 'wasm-fallback'];
  if (profile.ios) reasons.push('ios');
  if (profile.mobile) reasons.push('mobile');
  const maxInputPixels = profile.ios ? Math.min(IOS_CANVAS_LIMIT, c.maxInputPixels) : c.maxInputPixels;
  return {
    quality: 'medium',
    backend: profile.backend,
    ios: profile.ios,
    mobile: profile.mobile,
    memoryBudgetMB: c.memoryBudgetMB,
    maxInputPixels,
    reasons,
  };
}

export async function probeDeviceProfile(): Promise<DeviceProfile> {
  const client = await probeAIClient();
  return resolveDeviceProfile(client);
}
