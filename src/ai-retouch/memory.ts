import { probeAIClient } from '../ai/client';
import type { DeviceProfile } from './device';

export interface RetouchPlan {
  inputSize: number; // 128 for BlazeFace
  estimatedPeakMB: number;
  maxInputPixels: number;
}

export function planRetouch(width: number, height: number, device: DeviceProfile, inputSize = 128): RetouchPlan {
  const pixels = Math.max(1, width) * Math.max(1, height);
  // BlazeFace at 128px is ~5 components (0.5 MB model + 0.2 MB tensor + 0.1 MB output)
  const base = 32;
  const pixelMB = Math.min(64, (pixels / 1_000_000) * 8);
  return {
    inputSize,
    estimatedPeakMB: base + pixelMB,
    maxInputPixels: device.maxInputPixels,
  };
}

export async function probeRetouchDevice(): Promise<DeviceProfile> {
  const client = await probeAIClient();
  const backend = client.backend;
  const ios = client.ios;
  const mobile = client.mobile;
  const memoryBudgetMB = backend === 'webgpu' ? (ios ? 512 : mobile ? 512 : 768) : (ios ? 384 : mobile ? 192 : 384);
  const maxInputPixels = backend === 'webgpu' ? (ios ? 4_000_000 : mobile ? 6_000_000 : 12_000_000) : (ios ? 1_000_000 : mobile ? 1_500_000 : 4_000_000);
  return { quality: 'medium', backend, ios, mobile, memoryBudgetMB, maxInputPixels, reasons: [backend] };
}
