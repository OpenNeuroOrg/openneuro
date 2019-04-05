import React from 'react'
import { shallow } from 'enzyme'
import DatasetReadme from '../dataset-readme.jsx'

describe('DatasetReadme component', () => {
  it('renders with common props', () => {
    const wrapper = shallow(<DatasetReadme content="markdown goes here" />)
    expect(wrapper).toMatchSnapshot()
  })
})
