// Might be useful if this is shared by the browser uploader at some point
import "https://deno.land/x/indexeddb@1.3.5/polyfill.ts"
import git from "npm:isomorphic-git@1.25.3"
import http from "npm:isomorphic-git@1.25.3/http/node/index.js"
import fs from "node:fs"
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
  // .gitattributes
  attributes?: GitAnnexAttributes
}

let context: GitContext
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
    await fs.promises.access(join(dir, ".git"))
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
  try {
    const oid = await git.resolveRef({ ...options, ref: "main" }) ||
      await git.resolveRef({ ...options, ref: "master" })
    context.attributes = new TextDecoder().decode(
      (await git.readBlob({ ...options, oid, filepath: ".gitattributes" }))
        .blob,
    )
  } catch (_err) {
    logger.error(
      "Dataset repository is missing .gitattributes and may be improperly initialized.",
    )
    globalThis.close()
  }
  logger.info(`${context.datasetId} draft fetched!`)
}

/**
 * git-annex add equivalent
 */
async function add(event) {
  if (event.data.annexed) {
    // Compute hash and add link
  } else {
    // Simple add case
    const options = {
      ...gitOptions(context.repoPath),
      filepath: event.data.relativePath,
    }
    return
    // Hard link to the target location
    await ensureLink(
      event.data.path,
      join(context.repoPath, event.data.relativePath),
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
