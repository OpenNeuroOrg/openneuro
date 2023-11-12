import React from "react"
import { render } from "@testing-library/react"
import { MockedProvider } from "@apollo/client/testing"
import UpdateDescription, {
  mergeFieldValue,
  UPDATE_DESCRIPTION,
  UPDATE_DESCRIPTION_LIST,
} from "../description.jsx"

const mockMutation = vi.fn()
vi.mock("@apollo/client/react/components", () => ({
  ...vi.importActual("@apollo/client/react/components"),
  Mutation: (props) => {
    mockMutation(props)
    return <>Mutation mock</>
  },
}))

describe("UpdateDescription mutation", () => {
  it("renders with common props", () => {
    const { asFragment } = render(
      <UpdateDescription
        datasetId="ds001"
        field="Name"
        value="New Name"
        done={vi.fn()}
      />,
      { wrapper: MockedProvider },
    )
    expect(asFragment()).toMatchSnapshot()
  })
  it("uses the scalar mutation for scalar values", () => {
    render(
      <UpdateDescription
        datasetId="ds001"
        field="Name"
        value="New Name"
        done={vi.fn()}
      />,
      { wrapper: MockedProvider },
    )
    expect(mockMutation).toHaveBeenCalledWith(
      expect.objectContaining({ mutation: UPDATE_DESCRIPTION }),
    )
  })
  it("uses the list mutation for array values", () => {
    render(
      <UpdateDescription
        datasetId="ds001"
        field="Authors"
        value={["John Doe", "Jane Doe"]}
        done={vi.fn()}
      />,
      { wrapper: MockedProvider },
    )
    expect(mockMutation).toHaveBeenCalledWith(
      expect.objectContaining({ mutation: UPDATE_DESCRIPTION_LIST }),
    )
  })
  describe("mergeFieldValue()", () => {
    it("merges in scalar fields", () => {
      expect(
        mergeFieldValue(
          "ds001",
          {
            __typename: "Draft",
            id: "1234",
            created: "1999",
            description: {
              Name: "Old Name",
              BIDSVersion: "1.2",
              License: "AGPL3",
            },
          },
          { Name: "New Name", BIDSVersion: "1.2", License: "AGPL3" },
          null,
        ),
      ).toEqual({
        __typename: "Dataset",
        draft: {
          __typename: "Draft",
          created: "1999",
          description: {
            BIDSVersion: "1.2",
            License: "AGPL3",
            Name: "New Name",
          },
          id: "1234",
        },
        id: "ds001",
      })
    })
    it("merges in array fields", () => {
      expect(
        mergeFieldValue(
          "ds001",
          {
            __typename: "Draft",
            id: "1234",
            created: "1999",
            description: {
              Name: "Old Name",
              BIDSVersion: "1.2",
              License: "AGPL3",
              Authors: [],
            },
          },
          null,
          {
            Name: "New Name",
            BIDSVersion: "1.2",
            License: "AGPL3",
            Authors: ["One", "Two"],
          },
        ),
      ).toEqual({
        __typename: "Dataset",
        draft: {
          __typename: "Draft",
          created: "1999",
          description: {
            Authors: ["One", "Two"],
            BIDSVersion: "1.2",
            License: "AGPL3",
            Name: "New Name",
          },
          id: "1234",
        },
        id: "ds001",
      })
    })
  })
})
