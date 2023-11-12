import { assertEquals } from "https://deno.land/std@0.204.0/assert/mod.ts"
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
  const output = await gitCredentialAction(stdin, () => "token")
  assertEquals(output, "username=@openneuro/cli\npassword=token\n")
})
