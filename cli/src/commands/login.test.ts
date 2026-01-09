import { loginAction } from "./login.ts"
import { Select } from "@cliffy/prompt"
import { assertEquals } from "@std/assert/equals"
import { assertSpyCalls, stub } from "@std/testing/mock"
import { join } from "@std/path/join"

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

Deno.test("login action sets values in config file", async () => {
  const tmpDir = Deno.makeTempDirSync()
  const homeStub = stub(Deno.env, "get", (key) => {
    if (key === "XDG_CONFIG_HOME") return tmpDir
    return undefined
  })
  const loginOptions = {
    openneuroUrl: "https://example.com",
    token: "1234",
    errorReporting: true,
  }
  try {
    await loginAction(loginOptions)
    const configPath = join(tmpDir, "openneuro", "config.json")
    const config = JSON.parse(await Deno.readTextFile(configPath))
    console.log(config)
    assertEquals(config[loginOptions.openneuroUrl], loginOptions["token"])
    assertEquals(config.errorReporting, loginOptions.errorReporting)
  } finally {
    homeStub.restore()
    await Deno.remove(tmpDir, { recursive: true })
  }
})
