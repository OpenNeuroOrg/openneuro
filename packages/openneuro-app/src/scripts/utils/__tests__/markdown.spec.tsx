import React from "react"
import { render } from "@testing-library/react"
import { Markdown } from "../markdown"

describe("Test <Markdown> component", () => {
  it("safely handles broken HTML tags", () => {
    const brokenTagInput = "* Markdown document\n<br><br>\n * test content"
    const { asFragment } = render(<Markdown>{brokenTagInput}</Markdown>)
    expect(asFragment()).toMatchSnapshot()
  })
  it("filters out disallowed tags", () => {
    const badTags =
      '* Markdown document\n<script type="text/javascript">alert("this should not happen")</script>\n'
    const { asFragment } = render(<Markdown>{badTags}</Markdown>)
    expect(asFragment()).toMatchSnapshot()
  })
  it("allows a href with certain protocols", () => {
    const hrefExample =
      '<a href="https://example.com">Example link that should work.</a>'
    const { asFragment } = render(<Markdown>{hrefExample}</Markdown>)
    expect(asFragment()).toMatchSnapshot()
  })
  it("does not allow href with unknown protocols", () => {
    const hrefExample =
      '<a href="about:memory">Example link that should not work.</a>'
    const { asFragment } = render(<Markdown>{hrefExample}</Markdown>)
    expect(asFragment()).toMatchSnapshot()
  })
  it("filters close-break tags", () => {
    const hrefExample =
      '<br>sample text</br>'
    const { asFragment } = render(<Markdown>{hrefExample}</Markdown>)
    expect(asFragment()).toMatchSnapshot()
  })
})
