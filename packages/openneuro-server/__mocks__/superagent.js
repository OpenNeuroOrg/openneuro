'use strict'

var mockDelay
var mockError
var mockResponse = {
  status: function() {
    return 200
  },
  ok: true,
  get: jest.genMockFunction(),
  toError: jest.genMockFunction(),
}

var Request = {
  post: jest.genMockFunction().mockReturnThis(),
  get: jest.genMockFunction().mockReturnThis(),
  send: jest.genMockFunction().mockReturnThis(),
  query: jest.genMockFunction().mockReturnThis(),
  field: jest.genMockFunction().mockReturnThis(),
  set: jest.genMockFunction().mockReturnThis(),
  accept: jest.genMockFunction().mockReturnThis(),
  timeout: jest.genMockFunction().mockReturnThis(),
  end: jest.genMockFunction().mockImplementation(function(callback) {
    if (mockDelay) {
      this.delayTimer = setTimeout(callback, 0, mockError, mockResponse)

      return
    }

    callback(mockError, mockResponse)
  }),
  then: jest.genMockFunction().mockImplementation(cb => {
    cb(mockResponse)
  }),

  __setMockDelay: function(boolValue) {
    mockDelay = boolValue
  },
  __setMockResponse: function(mockRes) {
    mockResponse = mockRes
  },
  __setMockError: function(mockErr) {
    mockError = mockErr
  },
  __setMockResponseBody: function(body) {
    mockResponse.body = body
  },
}

module.exports = Request
