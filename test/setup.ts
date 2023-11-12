import "@testing-library/jest-dom/vitest"
import createFetchMock from "vitest-fetch-mock"
import { afterAll, vi } from "vitest"
import { setup, teardown } from "vitest-mongodb"

const fetchMock = createFetchMock(vi)

// sets globalThis.fetch and globalThis.fetchMock to our mocked version
fetchMock.enableMocks()

beforeAll(() => setup())

afterAll(() => teardown())
