import { setDuplexIfRequired } from "../setDuplexIfRequired.js"

describe("setDuplexIfRequired", () => {
  it("sets duplex on Node 18.13.0", () => {
    const requestOptions = {}
    setDuplexIfRequired("18.13.0", requestOptions)
    expect(requestOptions.duplex).toBe("half")
  })
  it("does not set duplex on Node 18.12.1", () => {
    const requestOptions = {}
    setDuplexIfRequired("18.12.1", requestOptions)
    expect(requestOptions.duplex).toBeUndefined()
  })
  it("sets duplex on Node 19.1.0", () => {
    const requestOptions = {}
    setDuplexIfRequired("19.1.0", requestOptions)
    expect(requestOptions.duplex).toBe("half")
  })
  it("does not set on Node 19.0.1", () => {
    const requestOptions = {}
    setDuplexIfRequired("19.0.1", requestOptions)
    expect(requestOptions.duplex).toBeUndefined()
  })
  it("does not set on Node 16.18.1", () => {
    const requestOptions = {}
    setDuplexIfRequired("16.18.1", requestOptions)
    expect(requestOptions.duplex).toBeUndefined()
  })
})
