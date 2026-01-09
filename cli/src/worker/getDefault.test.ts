import { assertEquals, assertRejects } from "@std/assert"
import { getDefault } from "./getDefault.ts"
import { GitWorkerContext } from "./types/git-context.ts"
import { join } from "@std/path"
import { default as git } from "isomorphic-git"

Deno.test("getDefault()", async (t) => {
  const testDir = await Deno.makeTempDir()
  const context = new GitWorkerContext(
    "ds000000",
    testDir,
    testDir,
    "http://localhost",
    "test",
  )
  await git.init({ ...context.config(), defaultBranch: "main" })
  await context.fs.promises.writeFile(join(testDir, "test.txt"), "test")
  await git.add({ ...context.config(), filepath: "test.txt" })
  await git.commit({
    ...context.config(),
    message: "test",
    author: {
      name: "Test Name",
      email: "test@example.com",
    },
  })
  await t.step("returns main if present", async () => {
    assertEquals(await getDefault(context), "main")
  })
  await t.step("returns master if main is not present", async () => {
    await git.branch({ ...context.config(), ref: "master" })
    await git.deleteBranch({ ...context.config(), ref: "main" })
    assertEquals(await getDefault(context), "master")
  })
  await t.step("throws if neither main or master are present", async () => {
    await git.deleteBranch({ ...context.config(), ref: "master" })
    await assertRejects(async () => await getDefault(context))
  })
  await Deno.remove(testDir, { recursive: true })
})
