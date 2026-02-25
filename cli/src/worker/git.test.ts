import { join, SEPARATOR } from "@std/path"
import { walk } from "@std/fs/walk"
import { default as git } from "isomorphic-git"
import { assertEquals } from "@std/assert/equals"
import { assertArrayIncludes } from "@std/assert/array-includes"
import { addGitFiles } from "../commands/upload.ts"
import fs from "node:fs"

Deno.test("adds git and annexed content given a directory of files", async () => {
  const testUpload = await Deno.makeTempDir()
  const testRepo = await Deno.makeTempDir()
  const testUrl = "https://example.com/repo.git"

  await git.init({
    fs,
    dir: testRepo,
    defaultBranch: "main",
  })

  const textEncoder = new TextEncoder()

  // Add .gitattributes directly here (add requires it)
  await Deno.writeFile(
    join(testRepo, ".gitattributes"),
    textEncoder.encode(`* annex.backend=SHA256E
**/.git* annex.largefiles=nothing
*.bval annex.largefiles=nothing
*.bvec annex.largefiles=nothing
*.json annex.largefiles=largerthan=1mb
*.tsv annex.largefiles=largerthan=1mb
dataset_description.json annex.largefiles=nothing
.bidsignore annex.largefiles=nothing
CHANGES annex.largefiles=nothing
README* annex.largefiles=nothing
LICENSE annex.largefiles=nothing`),
  )
  await git.add({ fs, dir: testRepo, filepath: ".gitattributes" })
  await git.commit({
    fs,
    dir: testRepo,
    author: {
      name: "OpenNeuro",
      email: "git@openneuro.org",
    },
    message: "Test suite repo, please ignore",
  })

  // dataset_description.json
  await Deno.writeFile(
    join(testUpload, "dataset_description.json"),
    textEncoder.encode(JSON.stringify({
      "Name": "Test Experiment",
      "BIDSVersion": "1.8.0",
      "DatasetType": "raw",
      "License": "CC0",
      "Authors": [
        "J. Doe",
        "J. Doe",
      ],
    })),
  )

  // An annexed nifti file
  const fakeNifti = new Uint8Array(65536)
  crypto.getRandomValues(fakeNifti)
  await Deno.mkdir(join(testUpload, "sub-01", "anat"), { recursive: true })
  await Deno.writeFile(
    join(testUpload, "sub-01", "anat", "sub-01_T1w.nii.gz"),
    fakeNifti,
  )

  // Create the git worker
  const worker = new Worker(new URL("../worker/git.ts", import.meta.url).href, {
    type: "module",
  })

  // Configure worker
  worker.postMessage({
    "command": "setup",
    "datasetId": "test_dataset",
    "repoPath": testRepo,
    "repoEndpoint": testUrl,
    "authorization":
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNjZhNzRjNS05ZDhmLTQ2M2MtOGE2ZS1lYTE3ODljYTNiOTIiLCJlbWFpbCI6Im5lbGxAZGV2LW5lbGwuY29tIiwicHJvdmlkZXIiOiJnb29nbGUiLCJuYW1lIjoiTmVsbCBIYXJkY2FzdGxlIiwiYWRtaW4iOnRydWUsImlhdCI6MTcwMDUyNDIzNCwiZXhwIjoxNzMyMDYwMjM0fQ.5glc_uoxqcRJ4KWn2EvRR0hH-ono2MPJH0wqvcXBIOg",
    "logLevel": "INFO",
  })

  await addGitFiles(worker, testUpload)

  // Setup a way to make sure the worker is finished
  const closedPromise = new Promise((resolve) => {
    worker.onmessage = (event) => {
      if (event.data.command === "closed") {
        resolve(true)
      }
    }
  })

  worker.postMessage({ command: "commit" })

  // Close after all tasks are queued
  worker.postMessage({ command: "done" })

  // Wait until the worker says it's closed
  await closedPromise

  const expectedFiles = [
    join(".git", "refs", "heads", "main"),
    join(".git", "refs", "heads", "git-annex"),
    join(".git", "config"),
    join(".git", "HEAD"),
    join(".git", "index"),
    ".gitattributes",
    "dataset_description.json",
    join("sub-01", "anat", "sub-01_T1w.nii.gz"),
  ]
  let gitObjects = 0
  for await (
    const walkEntry of walk(testRepo, {
      includeDirs: false,
      includeSymlinks: true,
    })
  ) {
    const relativePath = walkEntry.path.split(testRepo + SEPARATOR)[1]
    if (relativePath.startsWith(`.git${SEPARATOR}objects${SEPARATOR}`)) {
      gitObjects += 1
    } else {
      assertArrayIncludes(expectedFiles, [relativePath])
    }
  }
  assertEquals(gitObjects, 15)
})
