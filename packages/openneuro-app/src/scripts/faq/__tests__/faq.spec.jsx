import React from 'react'
import { shallow } from 'enzyme'
import Faq from '../faq'

describe('faq/faq/Faq', () => {
  it('renders successfully', () => {
    const wrapper = shallow(<Faq />)
    expect(wrapper).toMatchSnapshot()
  })
})
