import { vi } from "vitest"

// mock for superagent - __mocks__/superagent.js
class MockResponse {
  status() {
    return 200
  }
  ok() {
    return true
  }
  body() {
    return {}
  }
  get() {
    return vi.fn()
  }
  toError() {
    return vi.fn()
  }
}

const createRequestStub = (obj) => vi.fn(() => obj)

function Request() {
  this.mockResponse = new MockResponse()
  this.mockDelay = null
  this.mockError = null

  this.post = createRequestStub(this)
  this.get = createRequestStub(this)
  this.send = createRequestStub(this)
  this.query = createRequestStub(this)
  this.field = createRequestStub(this)
  this.set = createRequestStub(this)
  this.accept = createRequestStub(this)
  this.timeout = createRequestStub(this)
  this.then = (cb) => {
    return new Promise((resolve, reject) => {
      if (this.mockError) {
        return reject(this.mockError)
      }
      return resolve(cb(this.mockResponse))
    })
  }
  this.end = vi.fn().mockImplementation((callback) => {
    if (this.mockDelay) {
      this.delayTimer = setTimeout(
        callback,
        0,
        this.mockError,
        this.mockResponse,
      )

      return
    }

    callback(this.mockError, this.mockResponse)
  })
  //expose helper methods for tests to set
  this.__setMockDelay = (boolValue) => {
    this.mockDelay = boolValue
  }
  this.__setMockResponse = (mockRes) => {
    this.mockResponse = mockRes
  }
  this.__setMockError = (mockErr) => {
    this.mockError = mockErr
  }
}

export default new Request()
