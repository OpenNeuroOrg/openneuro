import React from "react"
import { screen } from "@testing-library/react"
import { searchRender } from "../../__helpers__/search-render"
import SortBySelect from "../sort-by-select"
import initialSearchParams from "../../initial-search-params"

const providerProps = {
  value: { searchParams: { ...initialSearchParams } },
}

describe("SortBySelect component", () => {
  it("displays Newest when parameters are set to default", () => {
    searchRender(<SortBySelect variables={{ query: { bool: {} } }} />, {
      providerProps,
    })
    expect(screen.getByText("SORT BY:").closest("div")).toHaveTextContent(
      "SORT BY: Newest",
    )
  })
  it("displays Newest when parameters are set to default and modality has changed", () => {
    searchRender(
      <SortBySelect
        variables={{
          query: {
            bool: {
              filter: [
                {
                  match: {
                    "latestSnapshot.summary.modalities": {
                      query: "mri",
                    },
                  },
                },
              ],
            },
          },
        }}
      />,
      {
        providerProps,
      },
    )
    expect(screen.getByText("SORT BY:").closest("div")).toHaveTextContent(
      "SORT BY: Newest",
    )
  })
  it("displays Relevance when any non-modality parameters are set away from default", () => {
    searchRender(
      <SortBySelect variables={{ query: { bool: { species: "Human" } } }} />,
      { providerProps },
    )
    expect(screen.getByText("SORT BY:").closest("div")).toHaveTextContent(
      "SORT BY: Relevance",
    )
  })
  it("displays Relevance with age of participants set", () => {
    searchRender(
      <SortBySelect
        variables={{
          query: {
            bool: {
              filter: [
                {
                  range: {
                    "latestSnapshot.summary.subjectMetadata.age": {
                      gte: 10,
                      lte: 100,
                      relation: "INTERSECTS",
                    },
                  },
                },
              ],
            },
          },
        }}
      />,
      { providerProps },
    )
    expect(screen.getByText("SORT BY:").closest("div")).toHaveTextContent(
      "SORT BY: Relevance",
    )
  })
})
