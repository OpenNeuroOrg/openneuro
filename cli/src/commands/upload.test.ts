import { assertEquals } from "@std/assert/equals"
import { hiddenPathPattern, shouldIncludeFile } from "./upload.ts"

Deno.test("hiddenPathPattern matches hidden files/dirs in subpaths", () => {
  assertEquals(hiddenPathPattern.test("derivatives/.git/config"), true)
  assertEquals(hiddenPathPattern.test("derivatives/.git/annex/objects/xx/yy/key"), true)
  assertEquals(hiddenPathPattern.test("derivatives/.datalad/config"), true)
  assertEquals(hiddenPathPattern.test("a/.git/b"), true)
  assertEquals(hiddenPathPattern.test("sub/.gitignore"), true)
  // Should not match dotfiles at root (no leading slash)
  assertEquals(hiddenPathPattern.test(".git/config"), false)
  assertEquals(hiddenPathPattern.test(".bidsignore"), false)
  // Should not match files that just contain a dot in name
  assertEquals(hiddenPathPattern.test("my.gitconfig"), false)
  assertEquals(hiddenPathPattern.test("file.nii.gz"), false)
})

Deno.test("shouldIncludeFile() includes regular dataset files", () => {
  assertEquals(shouldIncludeFile("dataset_description.json"), true)
  assertEquals(shouldIncludeFile("sub-01/anat/sub-01_T1w.nii.gz"), true)
  assertEquals(shouldIncludeFile("derivatives/sub-01/func/bold.nii.gz"), true)
})

Deno.test("shouldIncludeFile() includes .bidsignore", () => {
  assertEquals(shouldIncludeFile(".bidsignore"), true)
})

Deno.test("shouldIncludeFile() skips root hidden files and directories", () => {
  assertEquals(shouldIncludeFile(".git/config"), false)
  assertEquals(shouldIncludeFile(".git/annex/objects/abc/def/SHA256--xyz"), false)
  assertEquals(shouldIncludeFile(".datalad/config"), false)
  assertEquals(shouldIncludeFile(".gitattributes"), false)
})

Deno.test("shouldIncludeFile() skips hidden files/dirs in submodules", () => {
  // .git directories
  assertEquals(
    shouldIncludeFile("derivatives/.git/annex/objects/abc/def/SHA256--xyz"),
    false,
  )
  assertEquals(shouldIncludeFile("derivatives/.git/config"), false)
  assertEquals(shouldIncludeFile("sourcedata/.git/HEAD"), false)
  assertEquals(
    shouldIncludeFile("derivatives/preprocessing/.git/annex/objects/xx/yy/key"),
    false,
  )
  // Deeper nested paths
  assertEquals(
    shouldIncludeFile("derivatives/qa/.git/annex/objects/Xk/Mx/SHA256--abc"),
    false,
  )
  assertEquals(
    shouldIncludeFile("derivatives/fmriprep/sub-01/.datalad/config"),
    false,
  )
  // .datalad directories
  assertEquals(shouldIncludeFile("derivatives/.datalad/config"), false)
  assertEquals(shouldIncludeFile("sourcedata/.datalad/metadata/aggregate_v1.json"), false)
  // Other hidden files in submodules
  assertEquals(shouldIncludeFile("derivatives/.gitattributes"), false)
  assertEquals(shouldIncludeFile("sourcedata/.gitignore"), false)
})

Deno.test("shouldIncludeFile() includes symlinks in submodules", () => {
  // Symlinks themselves don't have .git in their path
  // They point to .git/annex/objects but the path we check is the symlink location
  assertEquals(shouldIncludeFile("derivatives/sub-01/anat/sub-01_T1w.nii.gz"), true)
})
