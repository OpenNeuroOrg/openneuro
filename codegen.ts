import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  // For the moment, we use a schema dumped by scripts/dump-schema.ts.
  // If we can make it work in the future, we may be able to point directly
  // at packages/openneuro-server/src/graphql/schema.ts, or import and pass
  // the generated text.
  // pnp seems to be the sticking point here, and I've given up for now.
  schema: "schema.graphql",
  documents: [
    "packages/openneuro-app/src/**/*.{ts,tsx}",
    "!packages/openneuro-app/src/gql/**",
    // Exclude files with duplicate operation names.
    // These must be deduplicated before they can be included.
    // Cross-file duplicates:
    "!packages/openneuro-app/src/scripts/datalad/mutations/snapshot.tsx",
    "!packages/openneuro-app/src/scripts/dataset/mutations/snapshot.tsx",
    "!packages/openneuro-app/src/scripts/dataset/download/download-script.tsx",
    "!packages/openneuro-app/src/scripts/dataset/snapshot-container.tsx",
    "!packages/openneuro-app/src/scripts/search/use-search-results.tsx",
    // Intra-file duplicates (two operations share a name):
    "!packages/openneuro-app/src/scripts/queries/dataset.ts",
    // Type mismatches (nullable list items vs non-nullable schema):
    "!packages/openneuro-app/src/scripts/dataset/files/files.tsx",
  ],
  generates: {
    "packages/openneuro-app/src/gql/": {
      preset: "client",
      presetConfig: { fragmentMasking: false },
      config: {
        scalars: {
          Date: "string",
          DateTime: "string",
          BigInt: "number",
          JSON: "unknown",
        },
        useTypeImports: true,
        avoidOptionals: { field: false, inputValue: false, object: false },
      },
    },
  },
  hooks: {
    afterAllFileWrite: ["deno fmt"],
  },
}

export default config
