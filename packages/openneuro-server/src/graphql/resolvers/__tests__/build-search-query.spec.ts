import { describe, expect, it } from "vitest"
import { buildElasticQuery } from "../build-search-query"

describe("buildElasticQuery", () => {
  it("by default limits search to datasets where metadata.syntheticDataset is false", () => {
    const { query, isEmpty } = buildElasticQuery({})
    expect(isEmpty).toBe(true)
    expect(query.bool.filter).toEqual([
      {
        term: {
          "metadata.syntheticDataset": false,
        },
      },
    ])
  })

  it("limits search to datasets where metadata.syntheticDataset is false when syntheticDataset is false", () => {
    const { query, isEmpty } = buildElasticQuery({ syntheticDataset: false })
    expect(isEmpty).toBe(true)
    expect(query.bool.filter).toEqual([
      {
        term: {
          "metadata.syntheticDataset": false,
        },
      },
    ])
  })

  it("limits search to datasets where metadata.syntheticDataset is true when syntheticDataset is true", () => {
    const { query, isEmpty } = buildElasticQuery({ syntheticDataset: true })
    expect(isEmpty).toBe(false)
    expect(query.bool.filter).toEqual([
      {
        term: {
          "metadata.syntheticDataset": true,
        },
      },
    ])
  })

  it("includes syntheticDataset: false filter along with user keyword query", () => {
    const { query, isEmpty } = buildElasticQuery({ keywords: ["brain"] })
    expect(isEmpty).toBe(false)
    expect(query.bool.must).toBeDefined()
    expect(query.bool.filter).toEqual([
      {
        term: {
          "metadata.syntheticDataset": false,
        },
      },
    ])
  })
})
