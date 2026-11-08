/** Small async helpers shared by the renderer and optional AI pipeline. */

export function abortError(message = 'Aborted'): Error {
  return typeof DOMException !== 'undefined'
    ? new DOMException(message, 'AbortError')
    : Object.assign(new Error(message), { name: 'AbortError' });
}

export function isAbortError(error: unknown): boolean {
  return (
    !!error &&
    typeof error === 'object' &&
    (error as { name?: string }).name === 'AbortError'
  );
}

export function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) throw abortError();
}

/** Yield to the browser so progress paint and cancellation can happen. */
export function nextFrame(): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(done);
    // rAF is paused when the tab is occluded or backgrounded. AI tiling must
    // still finish (and stay cancellable), so a timer is the safety net.
    setTimeout(done, 250);
  });
}
