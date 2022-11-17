import '@testing-library/jest-dom'
import createFetchMock from 'vitest-fetch-mock'
import { vi } from 'vitest'

const fetchMock = createFetchMock(vi)

// sets globalThis.fetch and globalThis.fetchMock to our mocked version
fetchMock.enableMocks()

process.on('unhandledRejection', reason => {
  // eslint-disable-next-line no-console
  console.log(`FAILED TO HANDLE PROMISE REJECTION`)
  throw reason
})
