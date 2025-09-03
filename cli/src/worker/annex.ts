import type { GitWorkerContext } from "./types/git-context.ts"
import type { Logger } from "@std/log"
import { basename, dirname, join, relative } from "@std/path"
import { default as git, TREE } from "isomorphic-git"

/**
 * Why are we using hash wasm over web crypto?
 * Web crypto cannot do streaming hashes of the common git-annex functions yet.
 */
import { createMD5, createSHA256 } from "hash-wasm"

/**
 * Mapping from annex key to relative paths
 */
export type AnnexKeyPaths = Record<string, string>

// Initialize a utf-8 text decoder for reuse
const textDecoder = new TextDecoder("utf-8")

/**
 * Reusable hash factories
 */
const computeHashMD5 = await createMD5()
const computeHashSHA256 = await createSHA256()

/**
 * git-annex hashDirLower implementation based on https://git-annex.branchable.com/internals/hashing/
 * Compute the directory path from a git-annex filename
 */
export async function hashDirLower(
  annexKey: string,
): Promise<[string, string]> {
  const computeMD5 = await createMD5()
  computeMD5.init()
  computeMD5.update(annexKey)
  const digest = computeMD5.digest("hex")
  return [digest.slice(0, 3), digest.slice(3, 6)]
}

/**
 * git-annex hashDirMixed implementation based on https://git-annex.branchable.com/internals/hashing/
 */
export async function hashDirMixed(
  annexKey: string,
): Promise<[string, string]> {
  const computeMD5 = await createMD5()
  computeMD5.init()
  computeMD5.update(annexKey)
  const digest = computeMD5.digest("binary")
  const firstWord = new DataView(digest.buffer).getUint32(0, true)
  const nums = Array.from({ length: 4 }, (_, i) => (firstWord >> (6 * i)) & 31)
  const letters = nums.map(
    (num) => "0123456789zqjxkmvwgpfZQJXKMVWGPF".charAt(num),
  )
  return [`${letters[1]}${letters[0]}`, `${letters[3]}${letters[2]}`]
}

/**
 * Return the relative path to the .git/annex directory from a repo relative path
 *
 * Used for symlink path cr\eation
 */
export function annexRelativePath(path: string) {
  return relative(dirname(join("/", path)), "/")
}

/**
 * Add a file to a configured annex
 * @param annexKeys Object with key to
 * @param hash Git annex hash string (e.g. MD5E or SHA256)
 * @param path Absolute path to the file being added
 * @param relativePath Repo relative path for file being added
 * @param size File size (to avoid additional stat call)
 * @param context GitWorkerContext objects
 */
export async function annexAdd(
  hash: string,
  path: string,
  relativePath: string,
  size: number,
  context: GitWorkerContext,
): Promise<boolean> {
  // E in the backend means include the file extension
  let extension = ""
  if (hash.endsWith("E")) {
    const filename = basename(relativePath)
    extension = filename.substring(filename.indexOf("."))
  }
  // Compute hash
  const computeHash = hash.startsWith("MD5")
    ? computeHashMD5
    : computeHashSHA256
  computeHash.init()
  const stream = context.fs.createReadStream(path, {
    highWaterMark: 1024 * 1024 * 10,
  })
  for await (const data of stream) {
    computeHash.update(data)
  }
  const digest = computeHash.digest("hex")
  const annexKey = `${hash}-s${size}--${digest}${extension}`
  const annexPath = join(
    ".git",
    "annex",
    "objects",
    ...(await hashDirMixed(annexKey)),
    annexKey,
    annexKey,
  )
  // Path to this file in our repo
  const fileRepoPath = join(context.repoPath, relativePath)

  let link
  let forceAdd = false
  try {
    // Test if the repo already has this object
    link = await context.fs.promises.readlink(fileRepoPath)
  } catch (_err) {
    forceAdd = true
  }

  // Calculate the relative symlinks for our file
  const symlinkTarget = join(
    annexRelativePath(relativePath),
    annexPath,
  )

  // Key has changed if the existing link points to another object
  if (forceAdd || link !== symlinkTarget) {
    // This object has a new annex hash, update the symlink and add it
    const symlinkTarget = join(
      annexRelativePath(relativePath),
      annexPath,
    )
    // Verify parent directories exist
    await context.fs.promises.mkdir(dirname(fileRepoPath), { recursive: true })
    // Remove the existing symlink or git file
    await context.fs.promises.rm(fileRepoPath, { force: true })
    // Create our new symlink pointing at the right annex object
    await context.fs.promises.symlink(symlinkTarget, fileRepoPath)
    const options = {
      ...context.config(),
      filepath: relativePath,
    }
    await git.add(options)
    return true
  } else {
    return false
  }
}

export async function readAnnexPath(
  logPath: string,
  context: GitWorkerContext,
): Promise<string> {
  const options = {
    ...context.config(),
    ref: "git-annex",
  }
  const annexBranchOid = await git.resolveRef(options)
  const { blob } = await git.readBlob({
    ...options,
    oid: annexBranchOid,
    filepath: logPath,
  })
  return textDecoder.decode(blob)
}

/**
 * Walk the git tree belonging to `ref` and return a mapping from annex keys to relative path
 * @param ref Git reference to scan for annex objects
 * @param logger Logger to use, reports what keys are found at INFO level
 * @param context GitWorkerContext configured for a repo
 */
export async function getAnnexKeys(
  ref: string,
  logger: Logger,
  context: GitWorkerContext,
): Promise<AnnexKeyPaths> {
  const annexKeys = {} as AnnexKeyPaths
  const annexedGitObjects: { path: string; oid: string }[] = []
  // Walk HEAD and find all annex symlinks
  await git.walk({
    ...context.config(),
    trees: [TREE({ ref })],
    map: async function (filepath, [entry]) {
      if (
        entry && await entry.type() === "blob" &&
        await entry.mode() === 0o120000
      ) {
        annexedGitObjects.push({ path: filepath, oid: await entry.oid() })
        const content = await entry.content()
        if (content) {
          const symlinkTarget = textDecoder.decode(content)
          const annexKey = basename(symlinkTarget)
          // Check that annexKey conforms to the git-annex key format
          // Other symlinks are allowed but may be rejected on push if they point outside of the repo
          if (
            annexKey.match(/^[A-Z0-9]+-s\d+--[0-9a-fA-F]+(\.[a-zA-Z0-9]+)?$/)
          ) {
            logger.info(`Found key "${annexKey}" in HEAD.`)
            annexKeys[annexKey] = filepath
          } else {
            logger.warn(
              `Skipping invalid annex key format: "${annexKey}" for file "${filepath}"`,
            )
          }
        }
      }
    },
  })

  if (annexedGitObjects.length > 0) {
    logger.info("Annexed objects in HEAD:")
    for (const obj of annexedGitObjects) {
      logger.info(`- ${obj.path} (OID: ${obj.oid})`)
    }
  } else {
    logger.info("No annexed objects found in HEAD.")
  }
  return annexKeys
}
