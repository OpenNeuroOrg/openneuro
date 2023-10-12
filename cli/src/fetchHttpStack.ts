/**
 * tus-js-client fetch stack adapter.
 *
 * Useful for environments such as Deno or web workers without native XMLHttpRequest.
 */
export class FetchHttpStack {
  createRequest(method: string, url: string) {
    return new FetchHttpRequest(method, url)
  }
  getName(): string {
    return "FetchHttpStack"
  }
}

export class FetchHttpRequest {
  #headers: Headers
  #method: string
  #url: string
  #abortController: AbortController
  #request: Request
  #progressHandler?: (bytesSent: number) => void

  constructor(method: string, url: string) {
    this.#abortController = new AbortController()
    this.#headers = new Headers()
    this.#method = method
    this.#url = url
    // This is a dummy request that is replaced later (for API compatibility only)
    this.#request = new Request(url, { method })
  }

  getMethod() {
    return this.#method
  }

  getURL() {
    return this.#url
  }

  setHeader(header: string, value: string) {
    this.#headers.set(header, value)
  }

  getHeader(header: string) {
    this.#headers.get(header)
  }

  setProgressHandler(progressHandler: (bytesSent: number) => void): void {
    this.#progressHandler = progressHandler
  }
  // Send the HTTP request with the provided request body. The value of the request body depends
  // on the platform and what `fileReader` implementation is used. With the default `fileReader`,
  // `body` can be
  // - in browsers: a TypedArray, a DataView a Blob, or null.
  // - in  Node.js: a Buffer, a ReadableStream, or null.
  async send(body: ReadableStream<Uint8Array>): Promise<FetchHttpResponse> {
    this.#request = new Request(this.#url, {
      body,
      signal: this.#abortController.signal,
      method: this.#method,
      headers: this.#headers,
    })
    const response = await fetch(this.#request)
    const text = await response.text()
    return new FetchHttpResponse(response, text)
  }

  abort(): Promise<void> {
    return new Promise((resolve) => {
      this.#abortController.signal.onabort = () => {
        resolve()
      }
      this.#abortController.abort()
    })
  }

  // Return an environment specific object, e.g. the XMLHttpRequest object in browsers.
  async getUnderlyingObject(): Promise<Request> {
    return this.#request
  }
}

export class FetchHttpResponse {
  #response: Response
  #body: string
  constructor(response: Response, body: string) {
    this.#response = response
    this.#body = body
  }
  getStatus(): number {
    return this.#response.status
  }
  getHeader(header: string): string | null {
    return this.#response.headers.get(header)
  }
  getBody(): string {
    return this.#body
  }

  // Return an environment specific object, e.g. the XMLHttpRequest object in browsers.
  getUnderlyingObject(): Response {
    return this.#response
  }
}
