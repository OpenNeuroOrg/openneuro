// mock for superagent - __mocks__/superagent.js

let mockDelay
let mockError
let mockResponse = {
  status() {
    return 200
  },
  ok() {
    return true
  },
  body: {},
  get: jest.fn(),
  toError: jest.fn(),
}

const createRequestStub = obj => jest.fn(() => obj)

function Request() {
  let self = this
  self.mockResponse = mockResponse
  self.mockDelay = mockDelay
  self.mockError = mockError

  self.post = createRequestStub(self)
  self.get = createRequestStub(self)
  self.send = createRequestStub(self)
  self.query = createRequestStub(self)
  self.field = createRequestStub(self)
  self.set = createRequestStub(self)
  self.accept = createRequestStub(self)
  self.timeout = createRequestStub(self)
  self.then = cb => {
    return new Promise((resolve, reject) => {
      if (self.mockError) {
        return reject(self.mockError)
      }
      return resolve(cb(self.mockResponse))
    })
  }
  self.end = jest.fn().mockImplementation(function(callback) {
    if (self.mockDelay) {
      this.delayTimer = setTimeout(
        callback,
        0,
        self.mockError,
        self.mockResponse,
      )

      return
    }

    callback(self.mockError, self.mockResponse)
  })
  //expose helper methods for tests to set
  self.__setMockDelay = boolValue => {
    self.mockDelay = boolValue
  }
  self.__setMockResponse = mockRes => {
    self.mockResponse = mockRes
  }
  self.__setMockError = mockErr => {
    self.mockError = mockErr
  }
}

module.exports = new Request()
