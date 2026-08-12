import { assertEquals, assertRejects } from "@std/assert"
import { join } from "@std/path"
import { createDataset, getLatestSnapshotVersion } from "./graphq.ts"
import { LoginError, ResponseError } from "./error.ts"
import { mockFetch } from "./tests/fetch-stub.ts"

// A trimmed down copy of what the server returns when the request carries no
// usable credentials. The real payload also includes a long server stacktrace.
const notLoggedInErrors = [
  {
    message: "You must be logged in to create a dataset.",
    locations: [{ line: 3, column: 3 }],
    path: ["createDataset"],
    extensions: {
      code: "INTERNAL_SERVER_ERROR",
      stacktrace: ["Error: You must be logged in to create a dataset."],
    },
  },
]

/**
 * Run a test body with the CLI config pointed at a throwaway directory
 * holding a valid looking API key
 * @param fn The test body to run
 */
async function withStubbedConfig(fn: () => Promise<void>) {
  const configHome = await Deno.makeTempDir()
  await Deno.mkdir(join(configHome, "openneuro"), { recursive: true })
  await Deno.writeTextFile(
    join(configHome, "openneuro", "config.json"),
    JSON.stringify({ "https://openneuro.org": "an-api-key" }),
  )
  const previousConfigHome = Deno.env.get("XDG_CONFIG_HOME")
  const previousUrl = Deno.env.get("OPENNEURO_URL")
  Deno.env.set("XDG_CONFIG_HOME", configHome)
  Deno.env.delete("OPENNEURO_URL")
  try {
    await fn()
  } finally {
    if (previousConfigHome === undefined) {
      Deno.env.delete("XDG_CONFIG_HOME")
    } else {
      Deno.env.set("XDG_CONFIG_HOME", previousConfigHome)
    }
    if (previousUrl !== undefined) {
      Deno.env.set("OPENNEURO_URL", previousUrl)
    }
    await Deno.remove(configHome, { recursive: true })
  }
}

/**
 * Run a test body with fetch answering every request with one JSON body
 * @param body The response body to return
 * @param fn The test body to run
 */
async function withResponse(body: unknown, fn: () => Promise<void>) {
  const fetchStub = mockFetch(new Response(JSON.stringify(body)))
  try {
    await fn()
  } finally {
    fetchStub.restore()
  }
}

Deno.test("createDataset() returns the new accession number", async () => {
  await withStubbedConfig(async () => {
    await withResponse(
      { data: { createDataset: { id: "ds000001" } } },
      async () => {
        assertEquals(await createDataset(true, false), "ds000001")
      },
    )
  })
})

Deno.test("createDataset() rejects a response with no accession number", async () => {
  await withStubbedConfig(async () => {
    // The server can answer with a null field and no top level error. The
    // resulting undefined accession number used to travel all the way to the
    // path join in the upload command and fail there instead.
    await withResponse({ data: { createDataset: null } }, async () => {
      await assertRejects(
        () => createDataset(true, false),
        ResponseError,
        "The server did not return an accession number for the new dataset.",
      )
    })
  })
})

Deno.test("createDataset() reports missing credentials as a LoginError", async () => {
  await withStubbedConfig(async () => {
    await withResponse({ errors: notLoggedInErrors }, async () => {
      const error = await assertRejects(
        () => createDataset(true, false),
        LoginError,
        "You must be logged in to create a dataset.",
      )
      // The message has to say what to do next, not just what went wrong
      assertEquals(error.message.includes("openneuro login"), true)
      // The server stacktrace is noise for someone running a command
      assertEquals(error.message.includes("stacktrace"), false)
    })
  })
})

Deno.test("createDataset() keeps only the messages for other failures", async () => {
  await withStubbedConfig(async () => {
    await withResponse(
      { errors: [{ message: "Dataset does not exist" }] },
      async () => {
        const error = await assertRejects(
          () => createDataset(true, false),
          ResponseError,
        )
        assertEquals(error.message, "Dataset does not exist")
      },
    )
  })
})

Deno.test("getLatestSnapshotVersion() keeps only the error messages", async () => {
  await withStubbedConfig(async () => {
    await withResponse({ errors: notLoggedInErrors }, async () => {
      const error = await assertRejects(
        () => getLatestSnapshotVersion("ds000001"),
        LoginError,
      )
      assertEquals(error.message.includes("stacktrace"), false)
    })
  })
})
