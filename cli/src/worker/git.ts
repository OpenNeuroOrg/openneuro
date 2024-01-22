// Might be useful if this is shared by the browser uploader at some point
import "https://deno.land/x/indexeddb@1.3.5/polyfill.ts"
import git from "npm:isomorphic-git@1.25.3"
import http from "npm:isomorphic-git@1.25.3/http/node/index.js"
import fs from "node:fs"
import {
  GitAnnexAttributes,
  matchGitAttributes,
  parseGitAttributes,
} from "../gitattributes.ts"
import { ensureLink, join } from "../deps.ts"
import { logger, setupLogging } from "../logger.ts"

// This error originates in isomorphic-git due to a bug in Deno 1.39.4
// https://github.com/denoland/deno/issues/21795
self.addEventListener("unhandledrejection", (e) => {
  if (String(e?.reason)?.endsWith("readfile ''")) {
    e.preventDefault()
  }
})

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

let context: GitContext
let attributesCache: GitAnnexAttributes
// Shut down if this is set
let done = false

function shutdownIfDone() {
  if (done) {
    globalThis.close()
  }
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
async function shouldBeAnnexed(absolutePath: string, relativePath: string) {
  const gitAttributes = await getGitAttributes()
  const attributes = matchGitAttributes(gitAttributes, relativePath)
  if (attributes.largefiles) {
    const { size } = await Deno.stat(absolutePath)
    if (size > attributes.largefiles) {
      return true
    } else {
      return false
    }
  }
  // No rules matched, default to annex
  return true
}

/**
 * git-annex add equivalent
 */
async function add(event) {
  const annexed = await shouldBeAnnexed(
    event.data.path,
    event.data.relativePath,
  )
  console.log(event.data.path, annexed)
  if (annexed) {
    // Compute hash and add link
  } else {
    // Simple add case
    const options = {
      ...gitOptions(context.repoPath),
      filepath: event.data.relativePath,
    }
    const targetPath = join(context.repoPath, event.data.relativePath)
    // Remove the target
    await Deno.remove(targetPath)
    // Hard link to the target location
    await ensureLink(
      event.data.path,
      targetPath,
    )
    await git.add(options)
    logger.info(`Added ${event.data.relativePath}`)
  }
}

self.onmessage = async (event) => {
  if (event.data.command === "setContext") {
    context = {
      datasetId: event.data.datasetId,
      sourcePath: event.data.sourcePath,
      repoPath: event.data.repoPath,
      repoEndpoint: event.data.repoEndpoint,
      authorization: event.data.authorization,
    }
    setupLogging(event.data.logLevel)
  } else if (event.data.command === "clone") {
    await update()
  } else if (event.data.command === "add") {
    await add(event)
  } else if (event.data.command === "done") {
    done = true
  }
}
