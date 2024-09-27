import React from "react"
import { render } from "@testing-library/react"
import { DataTable, extractDateString } from "../data-table"

const tableData = [
  { col1: "text", col2: 50, col3: "string value" },
  { col1: "more", col2: 75, col3: "more strings" },
]

describe("DataTable component", () => {
  it("renders a basic table", () => {
    const { asFragment } = render(<DataTable data={tableData}></DataTable>)
    expect(asFragment()).toMatchSnapshot()
  })
})

describe("extractDateString()", () => {
  it("handles invalid date format exceptions", () => {
    expect(() => extractDateString("1893-09-18T08:27:33")).not.toThrowError()
  })
})
