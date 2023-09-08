import '@testing-library/jest-dom/vitest'
import createFetchMock from 'vitest-fetch-mock'
import { vi, afterAll } from 'vitest'
import { setup, teardown } from 'vitest-mongodb'

// @ts-expect-error vitest-fetch-mock has out of date typing but still works
const fetchMock = createFetchMock(vi)

// sets globalThis.fetch and globalThis.fetchMock to our mocked version
fetchMock.enableMocks()

beforeAll(() => setup())

afterAll(() => teardown())
