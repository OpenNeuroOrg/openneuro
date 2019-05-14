import { appendCommentToTree } from '../comment.jsx'

const testTree = [
  {
    id: '5c8c1d44b25d23ca69e168b2',
    text:
      '{"blocks":[{"key":"2eqse","text":"This is a test comment.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    createDate: '2019-03-15T21:46:44.000Z',
    user: { email: 'nell@squishymedia.com', __typename: 'User' },
    replies: [
      {
        id: '5c8c1d4db25d23465be168b3',
        text:
          '{"blocks":[{"key":"t0rh","text":"Comment reply one level deep.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
        createDate: '2019-03-15T21:46:53.000Z',
        user: { email: 'nell@squishymedia.com', __typename: 'User' },
        replies: [
          {
            id: '5c8c1d55b25d2386eee168b4',
            text:
              '{"blocks":[{"key":"20s5h","text":"Comment reply two levels deep.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
            createDate: '2019-03-15T21:47:01.000Z',
            user: { email: 'nell@squishymedia.com', __typename: 'User' },
            replies: [],
            __typename: 'Comment',
          },
        ],
        __typename: 'Comment',
      },
    ],
    __typename: 'Comment',
  },
]

describe('CommentMutation', () => {
  describe('appendCommentToTree()', () => {
    it('prepends a top level comment', () => {
      const newComment = {
        id: '5c9bf9f154487708c9ccddb3',
        text:
          '{"blocks":[{"key":"898g8","text":"New top level comment.","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":22,"style":"CODE"}],"entityRanges":[],"data":{}}],"entityMap":{}}',
        createDate: '2019-03-27T22:32:17.371Z',
        user: { email: 'nell@squishymedia.com', __typename: 'User' },
        __typename: 'Comment',
      }
      const newCommentTree = appendCommentToTree(testTree, newComment)
      expect(newCommentTree).toHaveLength(2)
      expect(newCommentTree[0]).toBe(newComment)
    })
    it('extends replies if parentId is present', () => {
      const newComment = {
        id: '5c9bfb53544877d695ccddb4',
        text:
          '{"blocks":[{"key":"8eecf","text":"Comment reply three levels deep.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
        createDate: '2019-03-27T22:38:11.246Z',
        user: { email: 'nell@squishymedia.com', __typename: 'User' },
        parentId: '5c8c1d55b25d2386eee168b4',
        __typename: 'Comment',
      }
      const newCommentTree = appendCommentToTree(testTree, newComment)
      expect(newCommentTree).toHaveLength(1)
      expect(newCommentTree[0].replies[0].replies[0].replies[0]).toBe(
        newComment,
      )
    })
    it('prepends a top level comment if there are none', () => {
      const newComment = {
        id: '5c9bf9f154487708c9ccddb3',
        text:
          '{"blocks":[{"key":"898g8","text":"New top level comment.","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":22,"style":"CODE"}],"entityRanges":[],"data":{}}],"entityMap":{}}',
        createDate: '2019-03-27T22:32:17.371Z',
        user: { email: 'nell@squishymedia.com', __typename: 'User' },
        __typename: 'Comment',
      }
      const newCommentTree = appendCommentToTree([], newComment)
      expect(newCommentTree).toHaveLength(1)
      expect(newCommentTree[0]).toBe(newComment)
    })
    it('does not require the replies field on base tree', () => {
      const baseTree = [
        {
          id: '5c8c1d44b25d23ca69e168b2',
          text:
            '{"blocks":[{"key":"2eqse","text":"This is a test comment.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
          createDate: '2019-03-15T21:46:44.000Z',
          user: { email: 'nell@squishymedia.com', __typename: 'User' },
          __typename: 'Comment',
        },
      ]
      const newComment = {
        id: '5c9bfb53544877d695ccddb4',
        text:
          '{"blocks":[{"key":"8eecf","text":"Comment reply three levels deep.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
        createDate: '2019-03-27T22:38:11.246Z',
        user: { email: 'nell@squishymedia.com', __typename: 'User' },
        parentId: '5c8c1d44b25d23ca69e168b2',
        __typename: 'Comment',
      }
      const newCommentTree = appendCommentToTree(baseTree, newComment)
      expect(newCommentTree).toHaveLength(1)
      expect(newCommentTree[0].replies).toEqual([newComment])
    })
  })
})
