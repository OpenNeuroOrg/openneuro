import { assertEquals, assertRejects, assertStringIncludes } from "@std/assert"
import { assertSpyCalls, stub } from "@std/testing/mock"
import { getLogger } from "@std/log"
import { default as git } from "isomorphic-git"
import { pushBranch } from "./pushBranch.ts"
import { GitWorkerContext } from "./types/git-context.ts"

const context = new GitWorkerContext(
  "ds000000",
  "/source",
  "/preserved/repository",
  "https://example.com/repo.git",
  "test",
)
const logger = getLogger("pushBranch.test")

for (const ref of ["git-annex", "main", "master"]) {
  Deno.test(`pushBranch(${ref}) succeeds without retrying`, async () => {
    const result = { ok: true, error: null, refs: {} }
    using push = stub(git, "push", () => Promise.resolve(result))
    using warn = stub(logger, "warn")

    assertEquals(await pushBranch(context, logger, ref), result)
    assertSpyCalls(push, 1)
    assertEquals(push.calls[0].args[0].ref, ref)
    assertEquals(push.calls[0].args[0].dir, context.repoPath)
    assertSpyCalls(warn, 0)
  })

  Deno.test(`pushBranch(${ref}) retries transient failures`, async () => {
    const result = { ok: true, error: null, refs: {} }
    let attempts = 0
    using push = stub(git, "push", () => {
      attempts += 1
      return attempts < 3
        ? Promise.reject(new Error("Request timed out"))
        : Promise.resolve(result)
    })
    using warn = stub(logger, "warn")

    assertEquals(await pushBranch(context, logger, ref), result)
    assertSpyCalls(push, 3)
    assertSpyCalls(warn, 2)
    for (const call of push.calls) {
      assertEquals(call.args[0].ref, ref)
    }
  })

  for (const cause of [new Error("Request timed out"), null]) {
    Deno.test(`pushBranch(${ref}) reports exhaustion for ${cause}`, async () => {
      using push = stub(git, "push", () => Promise.reject(cause))
      using warn = stub(logger, "warn")

      const error = await assertRejects(
        () => pushBranch(context, logger, ref),
        Error,
        `Failed to push "${ref}" after 3 attempts`,
      )
      assertEquals(error.cause, cause)
      assertStringIncludes(error.message, context.repoPath)
      assertSpyCalls(push, 3)
      assertSpyCalls(warn, 2)
    })
  }
}
