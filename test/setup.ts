import '@testing-library/jest-dom'
import createFetchMock from 'vitest-fetch-mock'
import { vi } from 'vitest'
import 'ioredis'

// Redis calls are always optional so we mock them by default
// Specific tests should implement mocked behavior to validate Redis interaction
vi.mock('ioredis')

const fetchMock = createFetchMock(vi)

// sets globalThis.fetch and globalThis.fetchMock to our mocked version
fetchMock.enableMocks()
