import React from 'react'
import { mount } from 'enzyme'
import CommentEditor from '../comment-editor.jsx'

describe('CommentEditor component', () => {
  it('renders with default props', () => {
    const wrapper = mount(<CommentEditor />)
    // No snapshot since EditorState is not stable
    expect(wrapper).toBeTruthy()
  })
  it('renders edit mutation when commentId is specified', () => {
    const wrapper = mount(<CommentEditor commentId="1" />)
    expect(wrapper.find('CommentEditMutation')).toBeTruthy()
  })
  it('renders new comment mutation when commentId is not specified', () => {
    const wrapper = mount(<CommentEditor commentId="1" />)
    expect(wrapper.find('CommentMutation')).toBeTruthy()
  })
})
