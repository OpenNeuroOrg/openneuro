import React from 'react'
import fetch from 'jest-fetch-mock'
import fromEntries from 'object.fromentries'
import { jest } from '@jest/globals'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import './src/scripts/apm'

global.fetch = fetch

if (!Object.fromEntries) {
  fromEntries.shim()
}

vi.mock('./src/scripts/config')
