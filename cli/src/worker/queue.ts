export class PromiseQueue {
  private queue: ((...args: any[]) => Promise<any>)[] = []
  private running = false

  enqueue(promiseFn: (...args: any[]) => Promise<any>, ...args: any[]) {
    this.queue.push(() => promiseFn(...args))
    this.processQueue()
  }

  private async processQueue() {
    if (this.running) return

    this.running = true
    try {
      while (this.queue.length > 0) {
        const promiseFn = this.queue.shift()
        if (promiseFn) await promiseFn()
      }
    } finally {
      this.running = false
    }
  }
}
