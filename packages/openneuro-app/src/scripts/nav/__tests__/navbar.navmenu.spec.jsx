import React from 'react'
import { shallow, mount } from 'enzyme'
import NavMenu from '../navbar.navmenu.jsx'

// Need to mock the router because of withRouter in these components
jest.mock('react-router-dom', () => {
  return {
    NavLink: () => '',
    withRouter: component => component,
    withCookie: component => component,
  }
})

describe('NavMenu', () => {
  it('renders successfully', () => {
    const wrapper = shallow(<NavMenu />)
    expect(wrapper).toMatchSnapshot()
  })
})
