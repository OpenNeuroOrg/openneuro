import { assertEquals } from "@std/assert/equals"
import {
  cleanCache,
  getRepoDir,
  getRepoStorageKey,
  LOCAL_STORAGE_KEY_PREFIX,
} from "./cache.ts"

Deno.test("getRepoStorageKey generates key with hostname prefix", () => {
  const url = new URL("https://openneuro.org")
  assertEquals(getRepoStorageKey(url), "openneuro_cli_openneuro.org_")

  const stagingUrl = new URL("https://staging.openneuro.org:8443/api")
  assertEquals(
    getRepoStorageKey(stagingUrl),
    "openneuro_cli_staging.openneuro.org_",
  )
})

Deno.test("getRepoDir returns existing directory from localStorage", async () => {
  const url = new URL("https://test.example.com")
  const key = getRepoStorageKey(url)
  const fakeDir = await Deno.makeTempDir({ prefix: "custom_test_" })
  try {
    localStorage.setItem(key, fakeDir)
    const result = await getRepoDir(url)
    assertEquals(result, fakeDir)
  } finally {
    localStorage.removeItem(key)
    try {
      await Deno.remove(fakeDir, { recursive: true })
    } catch {
      // ignore
    }
  }
})

Deno.test("getRepoDir creates new directory if not in localStorage", async () => {
  const url = new URL("https://new-test.example.com")
  const key = getRepoStorageKey(url)
  localStorage.removeItem(key)
  let createdDir: string | null = null
  try {
    createdDir = await getRepoDir(url)
    assertEquals(localStorage.getItem(key), createdDir)
    const stat = await Deno.stat(createdDir)
    assertEquals(stat.isDirectory, true)
  } finally {
    localStorage.removeItem(key)
    if (createdDir) {
      try {
        await Deno.remove(createdDir, { recursive: true })
      } catch {
        // ignore
      }
    }
  }
})

Deno.test("cleanCache clears directories from disk and removes keys from localStorage", async () => {
  const dir1 = await Deno.makeTempDir({
    prefix: `${LOCAL_STORAGE_KEY_PREFIX}host1_`,
  })
  const dir2 = await Deno.makeTempDir({
    prefix: `${LOCAL_STORAGE_KEY_PREFIX}host2_`,
  })
  const key1 = `${LOCAL_STORAGE_KEY_PREFIX}host1_`
  const key2 = `${LOCAL_STORAGE_KEY_PREFIX}host2_`
  localStorage.setItem(key1, dir1)
  localStorage.setItem(key2, dir2)

  const results = await cleanCache()
  assertEquals(results.length >= 2, true)
  assertEquals(localStorage.getItem(key1), null)
  assertEquals(localStorage.getItem(key2), null)

  let dir1Exists = true
  try {
    await Deno.stat(dir1)
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      dir1Exists = false
    }
  }
  assertEquals(dir1Exists, false)

  let dir2Exists = true
  try {
    await Deno.stat(dir2)
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      dir2Exists = false
    }
  }
  assertEquals(dir2Exists, false)
})

Deno.test("cleanCache with url filters by hostname", async () => {
  const dir1 = await Deno.makeTempDir({
    prefix: `${LOCAL_STORAGE_KEY_PREFIX}target.org_`,
  })
  const dir2 = await Deno.makeTempDir({
    prefix: `${LOCAL_STORAGE_KEY_PREFIX}other.org_`,
  })
  const key1 = `${LOCAL_STORAGE_KEY_PREFIX}target.org_`
  const key2 = `${LOCAL_STORAGE_KEY_PREFIX}other.org_`
  localStorage.setItem(key1, dir1)
  localStorage.setItem(key2, dir2)

  try {
    const results = await cleanCache({ url: "https://target.org" })
    assertEquals(results.length, 1)
    assertEquals(results[0].key, key1)
    assertEquals(localStorage.getItem(key1), null)
    assertEquals(localStorage.getItem(key2), dir2)
  } finally {
    localStorage.removeItem(key1)
    localStorage.removeItem(key2)
    try {
      await Deno.remove(dir1, { recursive: true })
    } catch {
      // ignore
    }
    try {
      await Deno.remove(dir2, { recursive: true })
    } catch {
      // ignore
    }
  }
})

Deno.test("cleanCache with dryRun does not delete directories or remove localStorage keys", async () => {
  const dir = await Deno.makeTempDir({
    prefix: `${LOCAL_STORAGE_KEY_PREFIX}dryrun_`,
  })
  const key = `${LOCAL_STORAGE_KEY_PREFIX}dryrun_`
  localStorage.setItem(key, dir)

  try {
    const results = await cleanCache({ dryRun: true })
    const matched = results.find((r) => r.key === key)
    assertEquals(matched?.key, key)
    assertEquals(matched?.deleted, false)
    assertEquals(localStorage.getItem(key), dir)
    const stat = await Deno.stat(dir)
    assertEquals(stat.isDirectory, true)
  } finally {
    localStorage.removeItem(key)
    try {
      await Deno.remove(dir, { recursive: true })
    } catch {
      // ignore
    }
  }
})

Deno.test("cleanCache handles missing directory gracefully", async () => {
  const nonExistentPath = "/tmp/non_existent_openneuro_test_dir_12345"
  const key = `${LOCAL_STORAGE_KEY_PREFIX}missing_`
  localStorage.setItem(key, nonExistentPath)

  const results = await cleanCache()
  const matched = results.find((r) => r.key === key)
  assertEquals(matched?.key, key)
  assertEquals(matched?.deleted, false)
  assertEquals(localStorage.getItem(key), null)
})
