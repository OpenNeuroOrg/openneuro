import React from 'react'
import { shallow } from 'enzyme'
import DatasetAuthors from '../dataset-authors.jsx'

describe('DatasetAuthors component', () => {
  it('renders with common props', () => {
    const wrapper = shallow(<DatasetAuthors authors={['One', 'Two']} />)
    expect(wrapper).toMatchSnapshot()
  })
})
