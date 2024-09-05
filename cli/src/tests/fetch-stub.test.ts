import { mockFetch } from "./fetch-stub.ts"
import { assertEquals } from "@std/assert/equals"
import { assertSpyCallArgs, assertSpyCalls } from "@std/testing/mock"

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
