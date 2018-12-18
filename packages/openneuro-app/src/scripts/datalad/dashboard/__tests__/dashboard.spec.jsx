import React from 'react'
import { shallow } from 'enzyme'
import Dashboard from '../dashboard.jsx'

describe('Dashboard', () => {
  it('my datasets renders successfully', () => {
    expect(shallow(<Dashboard />)).toMatchSnapshot()
  })
  it('public dashboard renders successfully', () => {
    expect(shallow(<Dashboard public />)).toMatchSnapshot()
  })
})
