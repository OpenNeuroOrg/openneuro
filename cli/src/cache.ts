import { logger } from "./logger.ts"

export const LOCAL_STORAGE_KEY_PREFIX = "openneuro_cli_"

export function getRepoStorageKey(url: URL): string {
  return `${LOCAL_STORAGE_KEY_PREFIX}${url.hostname}_`
}

export async function getRepoDir(url: URL): Promise<string> {
  const storageKey = getRepoStorageKey(url)
  const repoDir = localStorage.getItem(storageKey)
  if (repoDir) {
    return repoDir
  } else {
    const tmpDir = await Deno.makeTempDir({ prefix: storageKey })
    localStorage.setItem(storageKey, tmpDir)
    return tmpDir
  }
}

export interface CleanCacheOptions {
  url?: string
  dryRun?: boolean
}

export interface CleanCacheResult {
  key: string
  path: string
  deleted: boolean
}

export async function cleanCache(
  options: CleanCacheOptions = {},
): Promise<CleanCacheResult[]> {
  const results: CleanCacheResult[] = []
  const keysToClean: string[] = []

  let targetKey: string | null = null
  if (options.url) {
    try {
      const parsedUrl = new URL(options.url)
      targetKey = getRepoStorageKey(parsedUrl)
    } catch {
      logger.warn(`Invalid URL provided to cleanCache: "${options.url}"`)
      return results
    }
  }

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) {
      if (targetKey) {
        if (key === targetKey) {
          keysToClean.push(key)
        }
      } else if (key.startsWith(LOCAL_STORAGE_KEY_PREFIX)) {
        keysToClean.push(key)
      }
    }
  }

  for (const key of keysToClean) {
    const repoDir = localStorage.getItem(key)
    if (repoDir) {
      let deleted = false
      if (!options.dryRun) {
        try {
          await Deno.remove(repoDir, { recursive: true })
          deleted = true
        } catch (err) {
          if (err instanceof Deno.errors.NotFound) {
            // Already deleted from disk
          } else {
            logger.warn(`Could not remove cache directory ${repoDir}: ${err}`)
          }
        }
        localStorage.removeItem(key)
      }
      results.push({ key, path: repoDir, deleted })
    }
  }

  return results
}
