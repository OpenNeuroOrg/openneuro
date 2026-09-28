import React from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { MockedProvider } from "@apollo/client/testing"
import usePublicDatasetsCount, {
  ADVANCED_SEARCH_COUNT,
} from "../use-publicDatasets-count"

describe("usePublicDatasetsCount", () => {
  it("queries advancedSearch with All Public datasetType for front page", async () => {
    const mock = {
      request: {
        query: ADVANCED_SEARCH_COUNT,
        variables: {
          query: {},
          datasetType: "All Public",
        },
      },
      result: {
        data: {
          advancedSearch: {
            pageInfo: {
              count: 100,
            },
          },
        },
      },
    }

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockedProvider mocks={[mock]} addTypename={false}>
        {children}
      </MockedProvider>
    )

    const { result } = renderHook(() => usePublicDatasetsCount(), { wrapper })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data?.advancedSearch.pageInfo.count).toBe(100)
  })

  it("queries advancedSearch with modality and All Public datasetType for a modality portal", async () => {
    const mock = {
      request: {
        query: ADVANCED_SEARCH_COUNT,
        variables: {
          query: { modality: "mri" },
          datasetType: "All Public",
        },
      },
      result: {
        data: {
          advancedSearch: {
            pageInfo: {
              count: 42,
            },
          },
        },
      },
    }

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockedProvider mocks={[mock]} addTypename={false}>
        {children}
      </MockedProvider>
    )

    const { result } = renderHook(() => usePublicDatasetsCount("mri"), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data?.advancedSearch.pageInfo.count).toBe(42)
  })

  it("queries advancedSearch with brainInitiative for NIH portal", async () => {
    const mock = {
      request: {
        query: ADVANCED_SEARCH_COUNT,
        variables: {
          query: { brainInitiative: true },
          datasetType: "All Public",
        },
      },
      result: {
        data: {
          advancedSearch: {
            pageInfo: {
              count: 10,
            },
          },
        },
      },
    }

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockedProvider mocks={[mock]} addTypename={false}>
        {children}
      </MockedProvider>
    )

    const { result } = renderHook(() => usePublicDatasetsCount("nih"), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data?.advancedSearch.pageInfo.count).toBe(10)
  })
})
