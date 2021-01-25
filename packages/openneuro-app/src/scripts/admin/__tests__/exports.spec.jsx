import React from 'react'
import { shallow } from 'enzyme'
import Exports from '../exports.jsx'

describe('Dashboard', () => {
  it('my datasets renders successfully', () => {
    expect(shallow(<Exports />)).toMatchSnapshot()
  })
})
