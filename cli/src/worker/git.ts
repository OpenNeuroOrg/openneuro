// Might be useful if this is shared by the browser uploader at some point
import "https://deno.land/x/indexeddb@1.3.5/polyfill.ts"
import git from "npm:isomorphic-git@1.25.3"
import http from "npm:isomorphic-git@1.25.3/http/node/index.js"
import fs from "node:fs"
import {
  GitAnnexAttributes,
  GitAnnexBackend,
  matchGitAttributes,
  parseGitAttributes,
} from "../gitattributes.ts"
import { extname, join, LevelName } from "../deps.ts"
import { logger, setupLogging } from "../logger.ts"
import { PromiseQueue } from "./queue.ts"
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
}

/**
 * Events with no arguments
 */
interface GitWorkerEventGeneric {
  data: {
    command: "clone" | "commit" | "done"
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

async function done() {
  await globalThis.close()
}

function gitOptions(dir) {
  return {
    fs,
    http,
    dir,
    url: context.repoEndpoint,
    headers: {
      Authorization: context.authorization,
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
      singleBranch: true,
      depth: 1,
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
      globalThis.close()
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
 * git-annex add equivalent
 */
async function add(event: GitWorkerEventAdd) {
  const { size } = await fs.promises.stat(event.data.path)
  const annexed = await shouldBeAnnexed(
    event.data.relativePath,
    size,
  )
  console.log(event.data.path, annexed)
  if (annexed === "GIT") {
    // Simple add case
    const options = {
      ...gitOptions(context.repoPath),
      filepath: event.data.relativePath,
    }
    const targetPath = join(context.repoPath, event.data.relativePath)
    // Copy non-annexed files for git index creation
    await fs.promises.copyFile(event.data.path, targetPath)
    await git.add(options)
    logger.info(`Added ${event.data.relativePath}`)
  } else {
    // Compute hash and add link
    const computeHash = annexed.startsWith("MD5")
      ? await createMD5()
      : await createSHA256()
    // E in the backend means include the file extension
    const extension = annexed.endsWith("E")
      ? extname(event.data.relativePath)
      : ""
    computeHash.init()
    const stream = fs.createReadStream(event.data.path, {
      highWaterMark: 1024 * 1024 * 10,
    })
    for await (const data of stream) {
      computeHash.update(data)
    }
    const digest = computeHash.digest("hex")
    const annexKey = `${annexed}-${size}--${digest}${extension}`
    console.log(annexKey)
  }
}

/**
 * `git commit` equivalent
 */
async function commit() {
  console.log("Commit goes here")
}

const workQueue = new PromiseQueue()

self.onmessage = (event: GitWorkerEvent) => {
  if (event.data.command === "setup") {
    context = {
      datasetId: event.data.datasetId,
      sourcePath: event.data.sourcePath,
      repoPath: event.data.repoPath,
      repoEndpoint: event.data.repoEndpoint,
      authorization: event.data.authorization,
    }
    setupLogging(event.data.logLevel)
  } else if (event.data.command === "clone") {
    workQueue.enqueue(update)
  } else if (event.data.command === "add") {
    workQueue.enqueue(add, event)
  } else if (event.data.command === "commit") {
    workQueue.enqueue(commit)
  } else if (event.data.command === "done") {
    workQueue.enqueue(done)
  }
}
