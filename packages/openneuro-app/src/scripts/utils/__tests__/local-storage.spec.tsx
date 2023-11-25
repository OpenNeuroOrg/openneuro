import React, { useEffect } from "react"
import { render } from "@testing-library/react"
import { LocalStorageProvider, useLocalStorage } from "../local-storage.tsx"

const STORAGE_KEY = "tests"

const TestComponent = () => {
  const [value, setValue] = useLocalStorage(STORAGE_KEY)
  useEffect(() => {
    setValue("testing")
  }, [value])
  return null
}

describe("localStorage hooks", () => {
  beforeEach(() => {
    localStorage.clear()
  })
  afterEach(() => {
    localStorage.clear()
  })
  it("sets and retrieves a value", () => {
    render(
      <LocalStorageProvider defaultValue={{}}>
        <TestComponent />
      </LocalStorageProvider>,
    )
    expect(JSON.parse(localStorage.getItem("openneuro")).tests).toEqual(
      "testing",
    )
  })
})
