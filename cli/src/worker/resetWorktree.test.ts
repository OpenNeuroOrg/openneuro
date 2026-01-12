import { assertEquals } from "@std/assert"
import { resetWorktree } from "./resetWorktree.ts"
import { GitWorkerContext } from "./types/git-context.ts"
import { join } from "@std/path"
import { default as git } from "isomorphic-git"

Deno.test("resetWorktree()", async (t) => {
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
  await context.fs.promises.writeFile(join(testDir, "test2.txt"), "test")
  await git.add({ ...context.config(), filepath: "test2.txt" })
  await context.fs.promises.writeFile(join(testDir, "test3.txt"), "test")
  await t.step("cleans up dirty working trees", async () => {
    await resetWorktree(context, "main")
    const status = await git.status({
      ...context.config(),
      filepath: "test.txt",
    })
    assertEquals(status, "unmodified")
    try {
      await context.fs.promises.access(join(testDir, "test2.txt"))
      throw new Error("test2.txt should not exist")
    } catch (_err) {
      // Expected
    }
    try {
      await context.fs.promises.access(join(testDir, "test3.txt"))
      throw new Error("test3.txt should not exist")
    } catch (_err) {
      // Expected
    }
  })
  await Deno.remove(testDir, { recursive: true })
})
