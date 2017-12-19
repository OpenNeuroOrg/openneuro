import React from 'react'
import { shallow } from 'enzyme'
import NavMenu from '../navbar.navmenu.jsx'

jest.mock('../../user/user.store.js')
jest.mock('../../upload/upload.store.js')

describe('NavMenu', () => {
  it('renders successfully', () => {
    const wrapper = shallow(<NavMenu isLoggedIn={false} loading={false} />)
    expect(wrapper).toMatchSnapshot()
  })
})
