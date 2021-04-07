import React from 'react'
import { shallow } from 'enzyme'
import PETDummy from '../dummy.jsx'

describe('pet/dummy.jsx', () => {
  it('renders successfully', () => {
    const wrapper = shallow(<PETDummy />)
    expect(wrapper).toMatchSnapshot()
  })
})
