import comments from '../../handlers/comments'
import assert from 'assert'
import request from 'superagent'

const replyParams = {
  commentId: '5a78c0299991c800257b9b09',
  userId: 'teal@squishymedia.com',
}

// test reply generation when content sent to /comments/reply/commentId/userId
describe('comments/reply', () => {
  it('should return 404 when no commentId or userId are provided', () => {
    let mockReq = {
      body: replyParams,
    }
    let mockRes = {}
    comments.reply({}, {}, res => {
      console.log('res:', res)
      assert.equal(res.code, 200)
    })
  })

  it('should return a response that is not 404 when provided accurate information', () => {
    let mockReq = {
      data: {
        'stripped-text': 'squirtle',
      },
      params: replyParams,
    }
    let mockRes = {}
    comments.reply(mockReq, mockRes).then(data => {})
  })
})
