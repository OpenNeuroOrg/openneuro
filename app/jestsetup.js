// Make Enzyme functions available in all test files without importing
import React from 'react'
import { shallow, render, mount } from 'enzyme'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import moment from 'moment-timezone'

Enzyme.configure({ adapter: new Adapter() })

// Run all tests in virtual Katmandu (UTC +05:45)
moment.tz.setDefault('Asia/Katmandu')

global.React = React
global.shallow = shallow
global.render = render
global.mount = mount

jest.mock('./config.js')

// Fail tests on any warning
const fail_test_on_console = message => {
  throw new Error(message)
}
console.error = fail_test_on_console
console.warn = fail_test_on_console
