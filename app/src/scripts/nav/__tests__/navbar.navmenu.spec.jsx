import React from 'react'
import { shallow, mount } from 'enzyme'
import NavMenu from '../navbar.navmenu.jsx'

jest.mock('../../user/user.store.js')
jest.mock('../../upload/upload.store.js')
// Need to mock the router because of withRouter in these components
jest.mock('react-router-dom', () => {
  return {
    NavLink: () => '',
    withRouter: component => component,
  }
})

describe('NavMenu', () => {
  it('renders successfully', () => {
    const wrapper = shallow(<NavMenu isLoggedIn={false} loading={false} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('renders without "eventKey" warnings', () => {
    const component = mount(<NavMenu isLoggedIn={false} loading={false} />)
    expect(component).toMatchSnapshot()
  })
})
