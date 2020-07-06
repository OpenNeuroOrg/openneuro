import mockingoose from 'mockingoose'
import { deleteComment, flatten } from '../resolvers/comment'
import Comment from '../../models/comment'

const incrementHex = (hex, step = 1) => {
  hex = hex.toString()
  const splitLen = 14
  const start = hex.substr(0, splitLen)
  const end = hex.substr(splitLen)
  let dec = parseInt(end, 16)
  dec++
  return start + dec.toString(16)
}

describe('comment resolver helpers', () => {
  describe('deleteComment', () => {
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
      mockingoose.Comment.toReturn([], 'find')
      done()
    })

    it('returns an array of the deleted comment ids', async done => {
      const deletedIds = (await deleteComment({}, { commentId: aId })).map(id =>
        id.toString(),
      )

      // mockingoose ids are sequential, and the documents returned from each query get new ids for some reason
      //   TODO: Replace mockingoose with better library
      expect(deletedIds[0]).toEqual(incrementHex(aId))
      done()
    })
  })

  describe('flatten', () => {
    const arrarr = [
      [1, 2, 3],
      [4, 5],
    ]
    const arr = flatten(arrarr)
    expect(arr).toEqual([1, 2, 3, 4, 5])
  })
})
