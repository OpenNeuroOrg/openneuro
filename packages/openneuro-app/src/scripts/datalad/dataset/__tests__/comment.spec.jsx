import React from 'react'
import { mount } from 'enzyme'
import Comment from '../comment.jsx'

const emptyState =
  '{"blocks":[{"key":"3sm42","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}'

describe('Comment component', () => {
  it('renders with an empty comment', () => {
    const wrapper = mount(
      <Comment
        data={{
          id: '9001',
          text: emptyState,
          user: { id: '1234', email: 'example@example.com' },
        }}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
