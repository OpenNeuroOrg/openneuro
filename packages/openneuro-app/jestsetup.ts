import React from 'react'
// Make Enzyme functions available in all test files without importing
import Enzyme, { shallow, render, mount } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import fetch from 'jest-fetch-mock'
import fromEntries from 'object.fromentries'
import { jest } from '@jest/globals'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import './src/scripts/apm'

Enzyme.configure({ adapter: new Adapter() })

global.fetch = fetch

if (!Object.fromEntries) {
  fromEntries.shim()
}

jest.mock('./src/scripts/config')
