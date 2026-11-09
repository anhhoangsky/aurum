export interface QueuedJob<T> {
  run: (signal: AbortSignal) => Promise<T>;
  signal?: AbortSignal;
}

export class JobQueue {
  private tail: Promise<void> = Promise.resolve();
  private pending = 0;
  get length(): number { return this.pending; }
  enqueue<T>(job: QueuedJob<T>): Promise<T> {
    this.pending += 1;
    const result = this.tail.then(async () => {
      if (job.signal?.aborted) {
        const err = new Error('Aborted');
        err.name = 'AbortError';
        throw err;
      }
      return job.run(job.signal ?? new AbortController().signal);
    });
    this.tail = result.then(() => undefined, () => undefined).finally(() => { this.pending -= 1; });
    return result;
  }
}
