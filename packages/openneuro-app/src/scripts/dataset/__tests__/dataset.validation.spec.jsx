import React from 'react'
import { shallow } from 'enzyme'
import Validation from '../dataset.validation.jsx'

describe('dataset/Validation', () => {
  const defProps = {
    errors: [],
    warnings: [],
    validating: false,
    display: true,
  }
  it('renders successfully', () => {
    const wrapper = shallow(<Validation {...defProps} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('renders successfully when validating', () => {
    const wrapper = shallow(<Validation {...defProps} validating={true} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('displays nothing with display set to false', () => {
    const wrapper = shallow(<Validation {...defProps} display={false} />)
    expect(wrapper.html()).toBe(null)
  })
})
