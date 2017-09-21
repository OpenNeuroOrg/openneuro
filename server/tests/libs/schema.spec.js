import assert from 'assert'
import schema from '../../libs/schema'
import configSchema from '../../schemas/config'
import goodConfig from '../data/goodConfig'

describe('libs/schema.js', () => {
  describe('validateBody()', () => {
    it('should validate the json body of a post request', done => {
      let mockReq = { body: goodConfig }
      let mockRes = {}
      let validate = schema.validateBody(configSchema)
      validate(mockReq, mockRes, () => {
        done()
      })
    })
    it('should throw 400 error on invalid json', done => {
      let mockReq = { body: {} }
      let mockRes = {
        status: code => {
          // Check for the 400 code
          assert.equal(code, 400)
          return {
            send: err => {
              // Verify an error was returned
              assert.ok(err)
              done()
            },
          }
        },
      }
      let validate = schema.validateBody(configSchema)
      validate(mockReq, mockRes, () => {
        // Fail if next() is called
        assert.ok(false)
      })
    })
  })
})
