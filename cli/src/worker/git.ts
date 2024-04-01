import { git, STAGE, TREE } from "../deps.ts"
import http from "npm:isomorphic-git@1.25.3/http/node/index.js"
import fs from "node:fs"
import { decode } from "https://deno.land/x/djwt@v3.0.1/mod.ts"
import {
  GitAnnexAttributes,
  GitAnnexBackend,
  matchGitAttributes,
  parseGitAttributes,
} from "../gitattributes.ts"
import { basename, dirname, join, LevelName, relative } from "../deps.ts"
import { logger, setupLogging } from "../logger.ts"
import { PromiseQueue } from "./queue.ts"
import { checkKey, storeKey } from "./transferKey.ts"
import { ProgressBar } from "../deps.ts"

/**
 * Why are we using hash wasm over web crypto?
 * Web crypto cannot do streaming hashes of the common git-annex functions yet.
 */
import { createMD5, createSHA256 } from "npm:hash-wasm"

interface GitContext {
  // Current working dataset
  datasetId: string
  // The path being uploaded from to OpenNeuro
  sourcePath: string
  // The path of our local clone (possibly in virtual fs)
  repoPath: string
  // URL for the remote git repo
  repoEndpoint: string
  // OpenNeuro git access short lived API key
  authorization: string
  // Author name
  name: string
  // Author email
  email: string
}

/**
 * Events with no arguments
 */
interface GitWorkerEventGeneric {
  data: {
    command: "clone" | "commit" | "done" | "push"
  }
}

interface GitWorkerEventSetupData extends GitContext {
  command: "setup"
  logLevel: LevelName
}

/** Setup event to set dataset and repo state for commands until next call */
interface GitWorkerEventSetup {
  data: GitWorkerEventSetupData
}

/** Add event to add one file */
interface GitWorkerEventAdd {
  data: {
    command: "add"
    // Absolute path on the local system
    path: string
    // Dataset relative path
    relativePath: string
  }
}

type GitWorkerEvent =
  | GitWorkerEventSetup
  | GitWorkerEventGeneric
  | GitWorkerEventAdd

let context: GitContext
let attributesCache: GitAnnexAttributes

/**
 * Paths to upload to the remote annex
 */
const annexKeys: Record<string, string> = {}

async function done() {
  logger.info("Git worker shutdown.")
  // @ts-ignore
  await globalThis.postMessage({
    command: "closed",
  })
  await globalThis.close()
}

function gitOptions(dir: string) {
  return {
    fs,
    http,
    dir,
    url: context.repoEndpoint,
    headers: {
      Authorization: `Bearer ${context.authorization}`,
    },
  }
}

/**
 * Clone or fetch the draft
 */
async function update() {
  const options = gitOptions(context.repoPath)
  try {
    await fs.promises.access(join(context.repoPath, ".git"))
    logger.info(
      `Fetching ${context.datasetId} draft from "${context.repoEndpoint}"`,
    )
    await git.fetch(options)
  } catch (_err) {
    logger.info(
      `Cloning ${context.datasetId} draft from "${context.repoEndpoint}"`,
    )
    await git.clone({
      ...options,
    })
  }
  logger.info(`${context.datasetId} draft fetched!`)
}

/**
 * Load or return a cache copy of .gitattributes
 */
async function getGitAttributes(): Promise<GitAnnexAttributes> {
  if (!attributesCache) {
    const options = gitOptions(context.repoPath)
    try {
      const oid = await git.resolveRef({ ...options, ref: "main" }) ||
        await git.resolveRef({ ...options, ref: "master" })
      const rawAttributes = await git.readBlob({
        ...options,
        oid,
        filepath: ".gitattributes",
      })
      const stringAttributes = new TextDecoder().decode(rawAttributes.blob)
      attributesCache = parseGitAttributes(stringAttributes)
    } catch (_err) {
      logger.error(
        "Dataset repository is missing .gitattributes and may be improperly initialized.",
      )
      await done()
    }
  }
  return attributesCache
}

/**
 * Decide if this incoming file is annexed or not
 */
async function shouldBeAnnexed(
  relativePath: string,
  size: number,
): Promise<GitAnnexBackend> {
  const gitAttributes = await getGitAttributes()
  const attributes = matchGitAttributes(gitAttributes, relativePath)
  if (attributes.largefiles) {
    if (size > attributes.largefiles && attributes.backend) {
      return attributes.backend
    } else {
      return "GIT"
    }
  }
  // No rules matched, default to annex
  return "SHA256E"
}

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
 * Return the relative path to the .git/annex directory from a repo relative path
 *
 * Used for symlink path creation
 */
export function annexRelativePath(path: string) {
  return relative(dirname(join("/", path)), "/")
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

const computeHashMD5 = await createMD5()
const computeHashSHA256 = await createSHA256()

/**
 * git-annex add equivalent
 */
async function add(event: GitWorkerEventAdd) {
  const { size } = await fs.promises.stat(event.data.path)
  const annexed = await shouldBeAnnexed(
    event.data.relativePath,
    size,
  )
  if (annexed === "GIT") {
    // Simple add case
    const options = {
      ...gitOptions(context.repoPath),
      filepath: event.data.relativePath,
    }
    const targetPath = join(context.repoPath, event.data.relativePath)
    // Verify parent directories exist
    await fs.promises.mkdir(dirname(targetPath), { recursive: true })
    // Copy non-annexed files for git index creation
    await fs.promises.copyFile(event.data.path, targetPath)
    await git.add(options)
    logger.info(`Add\t${event.data.relativePath}`)
  } else {
    // E in the backend means include the file extension
    let extension = ""
    if (annexed.endsWith("E")) {
      const filename = basename(event.data.relativePath)
      extension = filename.substring(filename.indexOf("."))
    }
    // Compute hash
    const computeHash = annexed.startsWith("MD5")
      ? computeHashMD5
      : computeHashSHA256
    computeHash.init()
    const stream = fs.createReadStream(event.data.path, {
      highWaterMark: 1024 * 1024 * 10,
    })
    for await (const data of stream) {
      computeHash.update(data)
    }
    const digest = computeHash.digest("hex")
    const annexKey = `${annexed}-s${size}--${digest}${extension}`
    const annexPath = join(
      ".git",
      "annex",
      "objects",
      ...(await hashDirMixed(annexKey)),
      annexKey,
      annexKey,
    )
    // Path to this file in our repo
    const fileRepoPath = join(context.repoPath, event.data.relativePath)

    let link
    let forceAdd = false
    try {
      // Test if the repo already has this object
      link = await fs.promises.readlink(fileRepoPath)
    } catch (_err) {
      forceAdd = true
    }

    // Calculate the relative symlinks for our file
    const symlinkTarget = join(
      annexRelativePath(event.data.relativePath),
      annexPath,
    )

    // Key has changed if the existing link points to another object
    if (forceAdd || link !== symlinkTarget) {
      // Upload this key after the git commit
      annexKeys[annexKey] = event.data.path
      // This object has a new annex hash, update the symlink and add it
      const symlinkTarget = join(
        annexRelativePath(event.data.relativePath),
        annexPath,
      )
      // Verify parent directories exist
      await fs.promises.mkdir(dirname(fileRepoPath), { recursive: true })
      // Remove the existing symlink or git file
      await fs.promises.rm(fileRepoPath, { force: true })
      // Create our new symlink pointing at the right annex object
      await fs.promises.symlink(symlinkTarget, fileRepoPath)
      const options = {
        ...gitOptions(context.repoPath),
        filepath: event.data.relativePath,
      }
      await git.add(options)
      logger.info(`Annexed\t${event.data.relativePath}`)
    } else {
      logger.info(`Unchanged\t${event.data.relativePath}`)
    }
  }
}

/**
 * Git repo specific token
 */
interface OpenNeuroGitToken {
  sub: string
  email: string
  provider: string
  name: string
  admin: boolean
  scopes: [string]
  dataset: string
  iat: number
  exp: number
}

/**
 * `git commit` equivalent
 */
async function commit() {
  const options = gitOptions(context.repoPath)
  const decodedToken = decode(context.authorization)
  const { email, name } = decodedToken[1] as OpenNeuroGitToken
  let generateCommit = false
  let changes = 0
  const tree = await git.walk({
    ...options,
    trees: [TREE({ ref: "HEAD" }), STAGE()],
    map: async function (filepath, [A, B]) {
      if (await A?.type() === "blob" || await B?.type() === "blob") {
        const Aoid = await A?.oid()
        const Boid = await B?.oid()
        let type = "equal"
        if (Aoid !== Boid && Aoid !== undefined && Boid !== undefined) {
          logger.info(`modified:\t${filepath}`)
          type = "modify"
        }
        if (Aoid === undefined) {
          logger.info(`new file:\t${filepath}`)
          type = "add"
        }
        if (Boid === undefined) {
          logger.info(`deleted:\t${filepath}`)
          type = "remove"
        }
        if (type !== "equal") {
          generateCommit = true
          changes += 1
        }
      }
    },
  })
  if (generateCommit) {
    console.log(
      `Detected ${changes} change${changes === 1 ? "" : "s"}.`,
    )
    const commitHash = await git.commit({
      ...options,
      author: {
        name,
        email,
      },
      message: "[OpenNeuro] Added local files",
    })
    logger.info(`Committed as "${commitHash}"`)
  } else {
    console.log("No changes found, not uploading.")
    workQueue.enqueue(done)
  }
}

/**
 * `git push` and `git-annex copy --to=openneuro`
 */
async function push() {
  let completed = 0
  const annexedObjects = Object.keys(annexKeys).length
  const progress = new ProgressBar({
    title: `Transferring annexed files`,
    total: annexedObjects,
  })
  if (annexedObjects > 0) {
    await progress.render(completed)
  }
  // Git-annex copy --to=openneuro
  for (const [key, path] of Object.entries(annexKeys)) {
    const checkKeyResult = await checkKey({
      url: context.repoEndpoint,
      token: context.authorization,
    }, key)
    if (checkKeyResult) {
      logger.info(`Skipping key "${key}" present on remote`)
    } else {
      let storeKeyResult = -1
      let retries = 3
      while (storeKeyResult === -1 && retries > 0) {
        retries -= 1
        storeKeyResult = await storeKey(
          {
            url: context.repoEndpoint,
            token: context.authorization,
          },
          key,
          path,
        )
        if (storeKeyResult === -1 && retries > 0) {
          logger.warn(`Failed to transfer annex object "${key}" - retrying`)
        }
      }
      if (storeKeyResult === -1) {
        logger.error(
          `Failed to transfer annex object "${key}" after ${retries} attempts`,
        )
      } else {
        completed += 1
        await progress.render(completed)
        logger.info(
          `Stored ${storeKeyResult} bytes for key "${key}" from path "${path}"`,
        )
      }
    }
  }
  console.log("Pushing changes...")
  // Git push
  await git.push(
    gitOptions(context.repoPath),
  )
  const url = new URL(context.repoEndpoint)
  console.log(
    `Upload complete, visit your dataset at ${url.protocol}//${url.host}/datasets/${context.datasetId}`,
  )
}

// Queue of tasks to perform in order
const workQueue = new PromiseQueue()

// @ts-ignore Expected for workers
self.onmessage = (event: GitWorkerEvent) => {
  if (event.data.command === "setup") {
    context = {
      datasetId: event.data.datasetId,
      sourcePath: event.data.sourcePath,
      repoPath: event.data.repoPath,
      repoEndpoint: event.data.repoEndpoint,
      authorization: event.data.authorization,
      name: event.data.name,
      email: event.data.email,
    }
    setupLogging(event.data.logLevel)
  } else if (event.data.command === "clone") {
    workQueue.enqueue(update)
  } else if (event.data.command === "add") {
    workQueue.enqueue(add, event)
  } else if (event.data.command === "commit") {
    workQueue.enqueue(commit)
  } else if (event.data.command === "push") {
    workQueue.enqueue(push)
  } else if (event.data.command === "done") {
    workQueue.enqueue(done)
  }
}
