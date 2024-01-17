import { assertEquals } from "./deps.ts"
import { parseGitAttributes } from "./gitattributes.ts"

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

Deno.test("parses a git-annex .gitattributes file", async () => {
  const parsed = parseGitAttributes(testAttributes)
  assertEquals<any>(parsed, {
    "*": { backend: "SHA256E" },
    "**/.git*": { largefiles: Infinity },
    "*.bval": { largefiles: Infinity },
    "*.bvec": { largefiles: Infinity },
    "*.json": { largefiles: 1024 * 1024 },
    "phenotype/*.tsv": { largefiles: 0 },
    "*.tsv": { largefiles: 1024 * 1024 },
    "dataset_description.json": { largefiles: Infinity },
    ".bidsignore": { largefiles: Infinity },
    "CHANGES": { largefiles: Infinity },
    "README*": { largefiles: Infinity },
    "LICENSE": { largefiles: Infinity, backend: "MD5E" },
  })
})
