import { assertEquals } from "@std/assert/equals"
import { cacheCleanAction } from "./cache.ts"
import { LOCAL_STORAGE_KEY_PREFIX } from "../cache.ts"
import { commandLine } from "../options.ts"

Deno.test("cacheCleanAction outputs 'No cached repositories found.' when cache is empty", async () => {
  localStorage.clear()
  const messages: string[] = []
  const originalLog = console.log
  console.log = (...args: unknown[]) => {
    messages.push(args.join(" "))
  }

  try {
    await cacheCleanAction({})
    assertEquals(messages.includes("No cached repositories found."), true)
  } finally {
    console.log = originalLog
  }
})

Deno.test("cacheCleanAction deletes and reports cleared directories", async () => {
  localStorage.clear()
  const tempDir = await Deno.makeTempDir({
    prefix: `${LOCAL_STORAGE_KEY_PREFIX}test_`,
  })
  const key = `${LOCAL_STORAGE_KEY_PREFIX}test_`
  localStorage.setItem(key, tempDir)

  const messages: string[] = []
  const originalLog = console.log
  console.log = (...args: unknown[]) => {
    messages.push(args.join(" "))
  }

  try {
    await cacheCleanAction({})
    assertEquals(
      messages.some((m) => m.startsWith("Removed cache directory:")),
      true,
    )
    assertEquals(messages.includes("Cleared 1 cache directory."), true)
    assertEquals(localStorage.getItem(key), null)
  } finally {
    console.log = originalLog
  }
})

Deno.test("cacheCleanAction supports --dry-run option", async () => {
  localStorage.clear()
  const tempDir = await Deno.makeTempDir({
    prefix: `${LOCAL_STORAGE_KEY_PREFIX}test_`,
  })
  const key = `${LOCAL_STORAGE_KEY_PREFIX}test_`
  localStorage.setItem(key, tempDir)

  const messages: string[] = []
  const originalLog = console.log
  console.log = (...args: unknown[]) => {
    messages.push(args.join(" "))
  }

  try {
    await cacheCleanAction({ dryRun: true })
    assertEquals(
      messages.some((m) => m.startsWith("Would remove:")),
      true,
    )
    assertEquals(messages.includes("Found 1 cache directory."), true)
    assertEquals(localStorage.getItem(key), tempDir)
  } finally {
    console.log = originalLog
    localStorage.removeItem(key)
    try {
      await Deno.remove(tempDir, { recursive: true })
    } catch {
      // ignore
    }
  }
})

Deno.test("commandLine parses 'cache clean' command", async () => {
  localStorage.clear()
  const messages: string[] = []
  const originalLog = console.log
  console.log = (...args: unknown[]) => {
    messages.push(args.join(" "))
  }

  try {
    await commandLine(["cache", "clean"])
    assertEquals(messages.includes("No cached repositories found."), true)
  } finally {
    console.log = originalLog
  }
})
