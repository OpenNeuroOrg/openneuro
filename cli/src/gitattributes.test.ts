import { assertEquals } from "@std/assert/equals"
import { assertObjectMatch } from "@std/assert/object-match"
import { matchGitAttributes, parseGitAttributes } from "./gitattributes.ts"

const testAttributes = `* annex.backend=SHA256E
**/.git* annex.largefiles=nothing
*.bval annex.largefiles=nothing
*.bvec annex.largefiles=nothing
*.json annex.largefiles=largerthan=1mb
phenotype/*.tsv annex.largefiles=anything
*.tsv annex.largefiles=largerthan=1mb
dataset_description.json annex.largefiles=nothing
.bidsignore annex.largefiles=nothing
CHANGES annex.largefiles=nothing
README* annex.largefiles=nothing
LICENSE annex.largefiles=nothing annex.backend=MD5E
`

Deno.test("parseGitAttributes() parses a git-annex .gitattributes file", async () => {
  const parsed = parseGitAttributes(testAttributes)
  assertObjectMatch(parsed, {
    "*": { backend: "SHA256E" },
    "**/.git*": {
      largefiles: Infinity,
    },
    "*.bval": { largefiles: Infinity },
    "*.bvec": { largefiles: Infinity },
    "*.json": { largefiles: 1024 * 1024 },
    "phenotype/*.tsv": { largefiles: 0 },
    "*.tsv": { largefiles: 1024 * 1024 },
    "dataset_description.json": {
      largefiles: Infinity,
    },
    ".bidsignore": { largefiles: Infinity },
    "CHANGES": { largefiles: Infinity },
    "README*": { largefiles: Infinity },
    "LICENSE": { largefiles: Infinity, backend: "MD5E" },
  })
})

Deno.test("matchGitAttributes() matches any relevant rules for a path", async () => {
  const attr = parseGitAttributes(testAttributes)
  assertEquals<any>(matchGitAttributes(attr, "derivatives/test_file.json"), {
    backend: "SHA256E",
    largefiles: 1024 * 1024,
  })
  assertEquals<any>(matchGitAttributes(attr, "dataset_description.json"), {
    backend: "SHA256E",
    largefiles: Infinity,
  })
  assertEquals<any>(matchGitAttributes(attr, "LICENSE"), {
    backend: "MD5E",
    largefiles: Infinity,
  })
})
