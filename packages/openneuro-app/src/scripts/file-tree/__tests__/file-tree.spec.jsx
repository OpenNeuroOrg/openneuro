import React from 'react'
import { shallow } from 'enzyme'
import FileTree from '../file-tree.jsx'

describe('FileTree component', () => {
  it('renders with default props', () => {
    expect(shallow(<FileTree />)).toMatchSnapshot()
  })
})
