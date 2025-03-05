import React from "react"
import { render } from "@testing-library/react"
import { ModalityLabel, modalityShortMapping } from "../modality-label"

describe("modalityShortMapping", () => {
  it("maps ieeg to iEEG", () => {
    expect(modalityShortMapping("ieeg")).toBe("iEEG")
  })
  it("maps iEEG to iEEG", () => {
    expect(modalityShortMapping("iEEG")).toBe("iEEG")
  })
  it("maps beh to Behavioral", () => {
    expect(modalityShortMapping("beh")).toBe("Behavioral")
  })
  it("maps motion to Motion", () => {
    expect(modalityShortMapping("motion")).toBe("Motion")
  })
  it("maps undefined to undefined", () => {
    expect(modalityShortMapping(undefined)).toBe(undefined)
  })
  it("maps null to null", () => {
    expect(modalityShortMapping(null)).toBe(null)
  })
  it("maps other to uppercase", () => {
    expect(modalityShortMapping("other")).toBe("OTHER")
  })
})

describe("ModalityLabel", () => {
  it("renders the short name", () => {
    const { getByText } = render(<ModalityLabel modality="ieeg" />)
    expect(getByText("iEEG")).toBeInTheDocument()
  })
})
