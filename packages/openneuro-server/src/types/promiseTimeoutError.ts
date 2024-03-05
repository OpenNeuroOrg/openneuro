export class PromiseTimeoutError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "PromiseTimeoutError"
  }
}
