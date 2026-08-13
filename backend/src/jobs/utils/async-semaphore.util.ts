/**
 * Custom AsyncSemaphore in vanilla TypeScript to limit concurrent operations.
 * Implements a Promise-based FIFO queue.
 */
export class AsyncSemaphore {
  private activeCount = 0;
  private readonly queue: Array<() => void> = [];

  constructor(private readonly maxConcurrency: number) {
    if (maxConcurrency < 1) {
      throw new Error("maxConcurrency must be at least 1");
    }
  }

  /**
   * Acquire a lock slot. Returns a promise that resolves when a slot is free.
   */
  async acquire(): Promise<void> {
    if (this.activeCount < this.maxConcurrency) {
      this.activeCount++;
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      this.queue.push(() => {
        this.activeCount++;
        resolve();
      });
    });
  }

  /**
   * Release a lock slot and notify the next waiting task in FIFO order.
   */
  release(): void {
    if (this.activeCount > 0) {
      this.activeCount--;
    }

    if (this.queue.length > 0) {
      const nextTask = this.queue.shift();
      if (nextTask) {
        nextTask();
      }
    }
  }

  /**
   * Returns current number of active concurrent tasks.
   */
  get active(): number {
    return this.activeCount;
  }

  /**
   * Returns current length of waiting queue.
   */
  get waiting(): number {
    return this.queue.length;
  }
}
