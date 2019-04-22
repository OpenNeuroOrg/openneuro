import React from 'react'
import { shallow } from 'enzyme'
import DatasetAuthors from '../dataset-authors.jsx'

describe('DatasetAuthors component', () => {
  it('renders with common props', () => {
    const wrapper = shallow(<DatasetAuthors authors={['One', 'Two']} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('renders when authors is null', () => {
    const wrapper = shallow(<DatasetAuthors />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders null when authors is not an array', () => {
    // Catch the expected PropTypes error
    // eslint-disable-next-line no-console
    console.error = jest.fn()
    const wrapper = shallow(<DatasetAuthors authors={''} />)
    expect(wrapper.getElement()).toBe(null)
  })
})
