import type { FetchOptions, TransferKeyState } from "./transferKey.ts"
import {
  checkKey,
  keyRequest,
  removeKey,
  retrieveKey,
  storeKey,
} from "./transferKey.ts"
import { assertEquals } from "@std/assert/equals"
import { assertStrictEquals } from "@std/assert/strict-equals"
import { mockFetch } from "../tests/fetch-stub.ts"

Deno.test({
  name: "keyRequest() generates correct Request object",
  fn() {
    const state: TransferKeyState = {
      url: "https://api.example.com",
      token: "secret_token",
    }
    const key = "sample_git_annex_key"
    const options: FetchOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }

    const result = keyRequest(state, key, options)

    assertEquals(result.method, "POST")
    assertEquals(
      result.url,
      "https://api.example.com/annex/sample_git_annex_key",
    )
    assertStrictEquals(
      result.headers.get("Authorization"),
      "Basic b3Blbm5ldXJvLWNsaTpzZWNyZXRfdG9rZW4=",
    )
    assertStrictEquals(result.headers.get("Content-Type"), "application/json")
  },
})

Deno.test({
  name: "storeKey() uploads successfully",
  async fn() {
    const mocked = mockFetch(new Response("", { status: 200 }))
    const testData = "test data here"
    const tmpFilePath = await Deno.makeTempFile()
    const textEncoder = new TextEncoder()
    await Deno.writeFile(tmpFilePath, textEncoder.encode(testData))

    try {
      const testFileSize = testData.length

      const result = await storeKey(
        { url: "http://localhost", token: "" },
        "key",
        tmpFilePath,
      )
      assertEquals(result, testFileSize)
    } finally {
      mocked.restore()
    }
  },
})

Deno.test({
  name: "storeKey() handles upload failure",
  async fn() {
    const mocked = mockFetch(new Response("", { status: 500 }))

    try {
      const result = await storeKey(
        { url: "http://localhost", token: "" },
        "key",
        "./deno.json",
      )
      assertEquals(result, -1)
    } finally {
      mocked.restore()
    }
  },
})

Deno.test({
  name: "retrieveKey() downloads successfully",
  async fn() {
    const testData = "test data here"
    const tmpFilePath = await Deno.makeTempFile()
    const mocked = mockFetch(new Response(testData, { status: 200 }))

    try {
      const result = await retrieveKey(
        { url: "http://localhost", token: "" },
        "key",
        tmpFilePath,
      )
      assertEquals(result, true)
    } finally {
      mocked.restore()
    }
  },
})

Deno.test({
  name: "retrieveKey() handles download failure (e.g., 404)",
  async fn() {
    const mocked = mockFetch(new Response("", { status: 404 }))
    try {
      const result = await retrieveKey(
        { url: "http://localhost", token: "" },
        "key",
        "output.file",
      )
      assertEquals(result, false)
    } finally {
      mocked.restore()
    }
  },
})

Deno.test({
  name: "checkKey() confirms key exists (status 200)",
  async fn() {
    const mocked = mockFetch(new Response("", { status: 200 }))
    try {
      const result = await checkKey(
        { url: "http://localhost", token: "" },
        "key",
      )
      assertEquals(result, true)
    } finally {
      mocked.restore()
    }
  },
})

Deno.test({
  name: "checkKey() identifies when key doesn't exist",
  async fn() {
    const mocked = mockFetch(new Response("", { status: 404 }))
    try {
      const result = await checkKey(
        { url: "http://localhost", token: "" },
        "key",
      )
      assertEquals(result, false)
    } finally {
      mocked.restore()
    }
  },
})

Deno.test({
  name: "removeKey() successful deletion (status 204)",
  async fn() {
    const mocked = mockFetch(new Response(null, { status: 204 }))
    try {
      const result = await removeKey(
        { url: "http://localhost", token: "" },
        "key",
      )
      assertEquals(result, true)
    } finally {
      mocked.restore()
    }
  },
})

Deno.test({
  name: "removeKey() handles failed deletion",
  async fn() {
    const mocked = mockFetch(new Response("", { status: 500 }))
    try {
      const result = await removeKey(
        { url: "http://localhost", token: "" },
        "key",
      )
      assertEquals(result, false)
    } finally {
      mocked.restore()
    }
  },
})
