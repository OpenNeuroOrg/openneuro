import React from 'react'
import { mount } from 'enzyme'
import Comments from '../comments.jsx'

const emptyState =
  '{"blocks":[{"key":"3sm42","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}'
const exampleComment = {
  id: 'xyz',
  text: emptyState,
  user: { id: '1234', email: 'example@example.com' },
  replies: [],
}

describe('Comments component', () => {
  it('renders one top level comment', () => {
    const wrapper = mount(
      <Comments datasetId="ds000001" comments={[exampleComment]} />,
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('recursively renders a tree of comments', () => {
    const comments = [{ ...exampleComment, replies: [exampleComment] }]
    const wrapper = mount(
      <Comments datasetId="ds000001" comments={[exampleComment]} />,
    )
  })
})
