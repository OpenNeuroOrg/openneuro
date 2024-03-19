import { assertEquals } from "../deps.ts"
import { assertSpyCallArgs, assertSpyCalls } from "../deps.ts"
import { mockFetch } from "./fetch-stub.ts"

Deno.test({
  name: "fetch test",
  async fn() {
    const mockFetchText = "__MOCK_FETCH__"
    const fetchStub = mockFetch(new Response(mockFetchText))
    try {
      const res = await fetch("foo.com")
      assertEquals(await res.text(), mockFetchText)
      assertSpyCallArgs(fetchStub, 0, ["foo.com"])
      assertSpyCalls(fetchStub, 1)
    } finally {
      fetchStub.restore()
    }
  },
})
