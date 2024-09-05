import { assertEquals } from "@std/assert/equals"
import { join } from "@std/path/join"
import { annexRelativePath, hashDirLower, hashDirMixed } from "./annex.ts"

Deno.test("annexRelativePath() returns appropriate paths", () => {
  assertEquals(
    annexRelativePath("sub-01/anat/sub-01_T1w.nii.gz"),
    join("..", ".."),
  )
})

Deno.test("hashDirLower() returns the correct key prefix", async () => {
  assertEquals(
    await hashDirLower(
      "SHA256E-s311112--c3527d7944a9619afb57863a34e6af7ec3fe4f108e56c860d9e700699ff806fb.nii.gz",
    ),
    ["2ed", "6ea"],
  )
})

Deno.test("hashDirMixed() returns the correct key prefix", async () => {
  assertEquals(
    await hashDirMixed(
      "SHA256E-s311112--c3527d7944a9619afb57863a34e6af7ec3fe4f108e56c860d9e700699ff806fb.nii.gz",
    ),
    ["Xk", "Mx"],
  )
})
