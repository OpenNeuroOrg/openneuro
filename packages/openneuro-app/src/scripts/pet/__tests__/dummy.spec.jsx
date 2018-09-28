import React from 'react'
import { shallow } from 'enzyme'
import PETDummy from '../dummy.jsx'

jest.mock('openneuro-content')

describe('pet/dummy.jsx', () => {
  it('renders successfully', () => {
    const wrapper = shallow(<PETDummy />)
    expect(wrapper).toMatchSnapshot()
  })
})
