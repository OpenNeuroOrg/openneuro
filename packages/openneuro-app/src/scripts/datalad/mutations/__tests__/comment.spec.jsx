import React from 'react'
import { shallow } from 'enzyme'
import { ContentState } from 'draft-js'
import CommentMutation, {
  commentStateFactory,
  newCommentsReducer,
  modifyCommentsReducer,
} from '../comment.jsx'

const ISO8601 = /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/

describe('CommentMutation', () => {
  it('renders with basic props', () => {
    const wrapper = shallow(<CommentMutation datasetId="ds001" />)
    expect(wrapper).toMatchSnapshot()
  })
  it('renders with common props', () => {
    const wrapper = shallow(
      <CommentMutation
        datasetId="ds001"
        parentId="1234"
        comment="new comment"
        profile={{ id: 'user', email: 'something@example.com' }}
        done={jest.fn()}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })
  describe('commentStateFactory', () => {
    it('returns values with __typename', () => {
      const commentState = ContentState.createFromText('test comment')
      const comment = commentStateFactory('12345', '5867', commentState, {
        email: 'something@example.com',
      })
      expect(comment).toHaveProperty('__typename', 'Comment')
      expect(comment.user).toHaveProperty('__typename', 'User')
      expect(comment.parent).toHaveProperty('__typename', 'Comment')
    })
    it('returns expected output', () => {
      const commentState = ContentState.createFromText('test comment')
      const comment = commentStateFactory('12345', '5867', commentState, {
        email: 'something@example.com',
      })
      expect(comment).toEqual({
        __typename: 'Comment',
        createDate: expect.stringMatching(ISO8601),
        id: '12345',
        parent: { __typename: 'Comment', id: '5867' },
        replies: [],
        text: expect.stringContaining(
          '"text":"test comment","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
        ),
        user: { __typename: 'User', email: 'something@example.com' },
      })
    })
  })
  describe('newCommentsReducer', () => {
    it('appends new comment when there are none', () => {
      const comment = ContentState.createFromText('test comment')
      const next = newCommentsReducer([], {
        commentId: '1234',
        comment,
        profile: { email: 'something@example.com' },
      })
      expect(next).toEqual([
        {
          __typename: 'Comment',
          createDate: expect.stringMatching(ISO8601),
          id: '1234',
          parent: null,
          replies: [],
          text: expect.stringContaining(
            '"text":"test comment","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
          ),
          user: { __typename: 'User', email: 'something@example.com' },
        },
      ])
    })
    it('appends a child comment', () => {
      const comment = ContentState.createFromText('test comment 2')
      const comments = [
        {
          __typename: 'Comment',
          createDate: '2019-08-30T19:34:56.427Z',
          id: '1234',
          parent: null,
          replies: [],
          text: '',
          user: { __typename: 'User', email: 'something@example.com' },
        },
      ]
      expect(
        newCommentsReducer(comments, {
          commentId: '1235',
          parentId: '1234',
          comment,
          profile: { email: 'something@example.com' },
        }),
      ).toEqual([
        {
          __typename: 'Comment',
          createDate: expect.stringMatching(ISO8601),
          id: '1234',
          parent: null,
          replies: [{ __typename: 'Comment', id: '1235' }],
          text: '',
          user: { __typename: 'User', email: 'something@example.com' },
        },
        {
          __typename: 'Comment',
          createDate: expect.stringMatching(ISO8601),
          id: '1235',
          parent: { __typename: 'Comment', id: '1234' },
          replies: [],
          text: expect.any(String),
          user: { __typename: 'User', email: 'something@example.com' },
        },
      ])
    })
  })
  describe('modifyCommentsReducer', () => {
    it('modifies a comment in place and returns new array', () => {
      const commentContent = 'edited test comment'
      const comment = ContentState.createFromText(commentContent)
      const comments = [
        {
          __typename: 'Comment',
          createDate: '2019-08-30T19:34:56.427Z',
          id: '1234',
          parent: null,
          replies: [],
          text: '',
          user: { __typename: 'User', email: 'something@example.com' },
        },
      ]
      expect(
        modifyCommentsReducer(comments, {
          commentId: '1234',
          comment,
        }),
      ).toEqual([
        {
          __typename: 'Comment',
          createDate: '2019-08-30T19:34:56.427Z',
          id: '1234',
          parent: null,
          replies: [],
          text: expect.stringContaining(commentContent),
          user: { __typename: 'User', email: 'something@example.com' },
        },
      ])
    })
  })
})
