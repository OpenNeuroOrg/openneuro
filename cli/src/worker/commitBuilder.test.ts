import { assertEquals, assertExists } from "@std/assert"
import { CommitBuilder } from "./commitBuilder.ts"
import { GitWorkerContext } from "./types/git-context.ts"
import { default as git } from "isomorphic-git"

Deno.test("CommitBuilder", async (t) => {
  const testDir = await Deno.makeTempDir()
  const context = new GitWorkerContext(
    "ds000000",
    testDir,
    testDir,
    "http://localhost",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNjZhNzRjNS05ZDhmLTQ2M2MtOGE2ZS1lYTE3ODljYTNiOTIiLCJlbWFpbCI6Im5lbGxAZGV2LW5lbGwuY29tIiwicHJvdmlkZXIiOiJnb29nbGUiLCJuYW1lIjoiTmVsbCBIYXJkY2FzdGxlIiwiYWRtaW4iOnRydWUsImlhdCI6MTcwMDUyNDIzNCwiZXhwIjoxNzMyMDYwMjM0fQ.5glc_uoxqcRJ4KWn2EvRR0hH-ono2MPJH0wqvcXBIOg",
  )

  // Initialize a repo for testing
  await git.init({ ...context.config(), defaultBranch: "main" })

  await t.step("creates a new commit on a new branch", async () => {
    const builder = new CommitBuilder(context)
    builder.add("file1.txt", "content1")
    builder.add("dir/file2.txt", "content2")

    const commitOid = await builder.commit("main", "initial commit")
    assertExists(commitOid)

    const log = await git.log({ ...context.config(), ref: "main" })
    assertEquals(log[0].commit.message, "initial commit\n")

    const { blob: b1 } = await git.readBlob({
      ...context.config(),
      oid: commitOid!,
      filepath: "file1.txt",
    })
    assertEquals(new TextDecoder().decode(b1), "content1")

    const { blob: b2 } = await git.readBlob({
      ...context.config(),
      oid: commitOid!,
      filepath: "dir/file2.txt",
    })
    assertEquals(new TextDecoder().decode(b2), "content2")
  })

  await t.step("updates existing tree with new commit", async () => {
    const builder = new CommitBuilder(context)
    // Update existing file and add a new one
    builder.add("file1.txt", "updated content")
    builder.add("new-file.txt", "new content")

    const commitOid = await builder.commit("main", "second commit")
    assertExists(commitOid)

    const log = await git.log({ ...context.config(), ref: "main" })
    assertEquals(log[0].commit.message, "second commit\n")
    assertEquals(log.length, 2)

    const { blob: b1 } = await git.readBlob({
      ...context.config(),
      oid: commitOid!,
      filepath: "file1.txt",
    })
    assertEquals(new TextDecoder().decode(b1), "updated content")

    const { blob: b2 } = await git.readBlob({
      ...context.config(),
      oid: commitOid!,
      filepath: "dir/file2.txt",
    })
    assertEquals(new TextDecoder().decode(b2), "content2")

    const { blob: b3 } = await git.readBlob({
      ...context.config(),
      oid: commitOid!,
      filepath: "new-file.txt",
    })
    assertEquals(new TextDecoder().decode(b3), "new content")
  })

  await t.step("handles binary data", async () => {
    const builder = new CommitBuilder(context)
    const binaryData = new Uint8Array([0, 1, 2, 3])
    builder.add("binary.bin", binaryData)

    const commitOid = await builder.commit("main", "binary commit")
    assertExists(commitOid)

    const { blob } = await git.readBlob({
      ...context.config(),
      oid: commitOid!,
      filepath: "binary.bin",
    })
    assertEquals(blob, binaryData)
  })

  await t.step("creates deep directory structures", async () => {
    const builder = new CommitBuilder(context)
    builder.add("a/b/c/d/file.txt", "deep")

    const commitOid = await builder.commit("main", "deep commit")
    assertExists(commitOid)

    const { blob } = await git.readBlob({
      ...context.config(),
      oid: commitOid!,
      filepath: "a/b/c/d/file.txt",
    })
    assertEquals(new TextDecoder().decode(blob), "deep")
  })

  // Clean up
  await Deno.remove(testDir, { recursive: true })
})
