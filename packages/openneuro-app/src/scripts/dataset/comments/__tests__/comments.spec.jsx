import React from 'react'
import { render } from '@testing-library/react'
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
    const { asFragment } = render(
      <Comments datasetId="ds000001" comments={[exampleComment]} />,
    )
    expect(asFragment()).toMatchSnapshot()
  })
  it('recursively renders a tree of comments', () => {
    const comments = [{ ...exampleComment, replies: [exampleComment] }]
    const { asFragment } = render(
      <Comments datasetId="ds000001" comments={comments} />,
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
