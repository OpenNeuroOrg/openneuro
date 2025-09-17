import React from "react"
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Comment from "../comment.jsx"
import formatDistanceToNow from "date-fns/formatDistanceToNow"

vi.mock("date-fns/formatDistanceToNow")
vi.mock("../../../config.ts")

const emptyState =
  '{"blocks":[{"key":"3sm42","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}'

describe("Comment component", () => {
  it("renders with an empty comment", () => {
    formatDistanceToNow.mockReturnValueOnce("almost 2 years")

    const wrapper = render(
      <MemoryRouter>
        <Comment
          data={{
            id: "9001",
            text: emptyState,
            user: {
              id: "1234",
              email: "example@example.com",
              name: "Example Exampler",
            },
            createDate: new Date("2019-04-02T19:56:41.222Z").toISOString(),
          }}
        />
      </MemoryRouter>,
    )
    expect(wrapper).toMatchSnapshot()
  })
  it("renders an ORCID user comment", () => {
    formatDistanceToNow.mockReturnValueOnce("almost 2 years")

    const wrapper = render(
      <MemoryRouter>
        <Comment
          data={{
            id: "9001",
            text: emptyState,
            user: {
              id: "1234",
              email: "example@example.com",
              name: "Example Exampler",
              orcid: "1234-5678-9101",
            },
            createDate: new Date("2019-04-02T19:56:41.222Z").toISOString(),
          }}
        />
      </MemoryRouter>,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
