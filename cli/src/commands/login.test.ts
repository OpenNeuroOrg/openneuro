import { loginAction } from "./login.ts"
import { Select } from "@cliffy/prompt"
import { assertEquals } from "@std/assert/equals"
import { assertSpyCalls, stub } from "@std/testing/mock"

Deno.test("login action supports non-interactive mode if all options are provided", async () => {
  const SelectStub = stub(Select, "prompt", () => {
    return new Promise<void>(() => {})
  })
  await loginAction({
    url: "https://example.com",
    token: "1234",
    errorReporting: false,
  })
  // Test to make sure we get here before the timeout
  assertSpyCalls(SelectStub, 0)
  SelectStub.restore()
  localStorage.clear()
})

Deno.test("login action sets values in localStorage", async () => {
  const loginOptions = {
    url: "https://example.com",
    token: "1234",
    errorReporting: true,
  }
  await loginAction(loginOptions)
  assertEquals(localStorage.getItem("url"), loginOptions.url)
  assertEquals(localStorage.getItem("token"), loginOptions.token)
  assertEquals(
    localStorage.getItem("errorReporting"),
    loginOptions.errorReporting.toString(),
  )
  localStorage.clear()
})
