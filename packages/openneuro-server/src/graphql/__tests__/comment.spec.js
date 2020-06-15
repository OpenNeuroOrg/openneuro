import mockingoose from 'mockingoose'
import { deleteComment } from '../resolvers/comment'
import Comment from '../../models/comment'

describe('comment resolver helpers', () => {
  describe('for deleteComment', () => {
    let aId
    let commentA, commentB, commentC
    beforeEach(async done => {
      mockingoose.resetAll()
      commentA = {
        text: 'a',
        createDate: new Date().toISOString(),
        user: { __typename: 'User', _id: 'userid' },
      }
      mockingoose.Comment.toReturn(commentA, 'findOne')
      aId = (await Comment.findById('just getting commentA here').exec())._id
      commentB = {
        text: 'bb',
        createDate: new Date().toISOString(),
        user: { __typename: 'User', _id: 'userid' },
        parentId: aId,
      }
      commentC = {
        text: 'cc',
        createDate: new Date().toISOString(),
        user: { __typename: 'User', _id: 'userid' },
        parentId: aId,
      }
      mockingoose.Comment.toReturn([commentB, commentC], 'find')
      done()
    })

    it('returns an array of the deleted comment ids', async done => {
      const deletedIds = await deleteComment({}, { commentId: aId })
      console.log(deletedIds)
      done()
    })
  })
})
