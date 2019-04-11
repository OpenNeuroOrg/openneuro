import React from 'react'
import { mount } from 'enzyme'
import { ApolloProvider } from 'react-apollo'
import FileTree from '../file-tree.jsx'

describe('FileTree component', () => {
  it('renders with default props', () => {
    expect(mount(<FileTree />)).toMatchSnapshot()
  })
  it('expands and closes when clicked', () => {
    // ApolloProvider isn't used in this test but must exist
    // When enzyme supports hooks, this can be simplified
    const wrapper = mount(
      <ApolloProvider client={{}}>
        <FileTree name="Top Level" />
      </ApolloProvider>,
    )
    expect(
      wrapper
        .find('button.btn-file-folder > i.type-icon')
        .hasClass('fa-folder-open'),
    ).toBe(false)
    wrapper.find('button').simulate('click')
    expect(
      wrapper
        .find('button.btn-file-folder > i.type-icon')
        .hasClass('fa-folder-open'),
    ).toBe(true)
    wrapper.find('button').simulate('click')
    expect(
      wrapper
        .find('button.btn-file-folder > i.type-icon')
        .hasClass('fa-folder-open'),
    ).toBe(false)
  })
})
