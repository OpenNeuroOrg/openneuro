import { assertEquals } from "@std/assert/equals"
import { gitCredentialAction } from "./git-credential.ts"

Deno.test("git-credential parses stdin correctly", async () => {
  const stdin = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(
        new TextEncoder().encode(
          "host=staging.openneuro.org\nprotocol=https\npath=/datasets/ds000001\n",
        ),
      )
      controller.close()
    },
  })
  const output = await gitCredentialAction(
    "staging.openneuro.org",
    stdin,
    async () => ({ token: "token", endpoint: 2 }),
  )
  assertEquals(output, "username=@openneuro/cli\npassword=token\n")
})
