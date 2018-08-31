'use strict'

var mockDelay
var mockError
var mockResponse = {
  status: function() {
    return 200
  },
  ok: true,
  get: jest.fn(),
  toError: jest.fn(),
}

var Request = {
  post: jest.fn().mockReturnThis(),
  get: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  query: jest.fn().mockReturnThis(),
  field: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  accept: jest.fn().mockReturnThis(),
  timeout: jest.fn().mockReturnThis(),
  end: jest.fn().mockImplementation(function(callback) {
    if (mockDelay) {
      this.delayTimer = setTimeout(callback, 0, mockError, mockResponse)

      return
    }

    callback(mockError, mockResponse)
  }),
  then: jest.fn().mockImplementation(cb => {
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
