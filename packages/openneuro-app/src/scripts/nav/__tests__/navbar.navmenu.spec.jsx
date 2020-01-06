import React from 'react'
import { shallow } from 'enzyme'
import NavMenu from '../navbar.navmenu.jsx'

// official Jest workaround for mocking methods not implemented in JSDOM
window.matchMedia =
  window.matchMedia ||
  function() {
    return {
      matches: false,
      addListener: function() {},
      removeListener: function() {},
    }
  }

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
