import React from "react"
import { render } from "@testing-library/react"
import { useLocalStorage } from "../local-storage.tsx"

const STORAGE_KEY = "tests"

const TestComponent = ({ prop }) => {
  const [value, setValue] = useLocalStorage(STORAGE_KEY, prop)
  return value
}

describe("localStorage hooks", () => {
  beforeEach(() => {
    localStorage.clear()
  })
  afterEach(() => {
    localStorage.clear()
  })
  it("sets and retrieves a value", () => {
    render(<TestComponent prop="test-value" />)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual("test-value")
  })
})
