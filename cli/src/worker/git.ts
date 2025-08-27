import type { GitWorkerEventAdd } from "./types/git-context.ts"
import type { GitAnnexAttributes, GitAnnexBackend } from "../gitattributes.ts"
import { matchGitAttributes, parseGitAttributes } from "../gitattributes.ts"
import { dirname, join } from "@std/path"
import { default as git, STAGE, TREE } from "isomorphic-git"
import { logger, setupLogging } from "../logger.ts"
import { PromiseQueue } from "./queue.ts"
import { checkKey, storeKey } from "./transferKey.ts"
import ProgressBar from "@deno-library/progress"
import { annexAdd, hashDirLower, readAnnexPath } from "./annex.ts"
import { GitWorkerContext } from "./types/git-context.ts"
import { resetWorktree } from "./resetWorktree.ts"
import { getDefault } from "./getDefault.ts"

let context: GitWorkerContext
let attributesCache: GitAnnexAttributes

/**
 * Paths to upload to the remote annex
 *
 * Keys are the annex key
 * Values are repo relative path
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

/**
 * Clone or fetch the draft
 */
async function update() {
  try {
    await context.fs.promises.access(join(context.repoPath, ".git"))
    logger.info(
      `Fetching ${context.datasetId} draft from "${context.repoEndpoint}"`,
    )
    // Reset first to be sure that an interrupted run didn't create untracked files
    await resetWorktree(context, await getDefault(context))
    logger.info("Fetching all branches.")
    // Now fetch and checkout the default branch
    await git.fetch(context.config())
    logger.info("Merging git-annex branch.")
    // Merge remote git-annex changes
    await git.merge(
      {
        ...context.config(),
        author: context.author,
        ours: "git-annex",
        theirs: "origin/git-annex",
      },
    )
    logger.info("Checkout latest HEAD.")
    // Make sure the default branch checkout is updated
    const defaultBranch = await getDefault(context)
    await git.checkout({
      ...context.config(),
      ref: defaultBranch, // Checkout main
      noUpdateHead: false, // Make sure we update the local branch HEAD
    })
  } catch (_err) {
    logger.info(
      `Cloning ${context.datasetId} draft from "${context.repoEndpoint}"`,
    )
    await git.clone(context.config())
    await git.fetch({ ...context.config(), ref: "git-annex" })
    try {
      await git.branch({
        ...context.config(),
        object: "origin/git-annex",
        ref: "git-annex",
      })
    } catch (_err) {
      logger.info(`git-annex branch creation skipped, already present`)
    }
  }
  logger.info(`${context.datasetId} draft fetched!`)
}

/**
 * Load or return a cache copy of .gitattributes
 */
async function getGitAttributes(): Promise<GitAnnexAttributes> {
  if (!attributesCache) {
    const options = context.config()
    try {
      const defaultBranch = await getDefault(context)
      const oid = await git.resolveRef({ ...options, ref: defaultBranch })
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
 * git-annex add equivalent
 */
async function add(event: GitWorkerEventAdd) {
  let size
  try {
    const stats = await context.fs.promises.stat(event.data.path)
    size = stats.size
  } catch (_err) {
    console.log(
      `${event.data.relativePath} could not be added, check if this file is accessible and not a broken symlink.`,
    )
    return await done()
  }
  const annexed = await shouldBeAnnexed(
    event.data.relativePath,
    size,
  )
  if (annexed === "GIT") {
    // Simple add case
    const options = {
      ...context.config(),
      filepath: event.data.relativePath,
    }
    const targetPath = join(context.repoPath, event.data.relativePath)
    // Verify parent directories exist
    await context.fs.promises.mkdir(dirname(targetPath), { recursive: true })
    // Copy non-annexed files for git index creation
    await context.fs.promises.copyFile(event.data.path, targetPath)
    await git.add(options)
    logger.info(`Add\t${event.data.relativePath}`)
  } else {
    if (
      await annexAdd(
        annexKeys,
        annexed,
        event.data.path,
        event.data.relativePath,
        size,
        context,
      )
    ) {
      logger.info(`Annexed\t${event.data.relativePath}`)
    } else {
      logger.info(`Unchanged\t${event.data.relativePath}`)
    }
  }
}

/**
 * Create the empty git-annex branch if needed
 */
async function createAnnexBranch() {
  const now = new Date()
  const timestamp = Math.floor(now.getTime() / 1000)
  const timezoneOffset = now.getTimezoneOffset()
  const commit = {
    message: "[OpenNeuro CLI] branch created",
    tree: "4b825dc642cb6eb9a060e54bf8d69288fbee4904",
    parent: [],
    author: {
      ...context.author,
      timestamp,
      timezoneOffset,
    },
    committer: {
      ...context.author,
      timestamp,
      timezoneOffset,
    },
  }
  const object = await git.writeCommit({ ...context.config(), commit })
  await git.branch({
    ...context.config(),
    ref: "git-annex",
    checkout: true,
    // Commit added above
    object,
  })
}

/**
 * Generate a commit for remote.log updates if needed
 */
async function remoteSetup() {
  const noAnnexKeys: Record<string, string> = {}
  await commitAnnexBranch(noAnnexKeys)
}

/**
 * Generate one commit for all pending git-annex branch changes
 */
async function commitAnnexBranch(annexKeys: Record<string, string>) {
  // Find the UUID of this repository if it exists already
  const expectedRemote = "OpenNeuro" // TODO - This could be more flexible?
  let uuid
  let uuidLog = ""
  try {
    uuidLog = await readAnnexPath("uuid.log", context)
  } catch (err) {
    if (err instanceof Error && err.name !== "NotFoundError") {
      throw err
    }
  }
  try {
    try {
      await git.checkout({
        ...context.config(),
        ref: "git-annex",
      })
    } catch (err) {
      // Create the branch if it doesn't exist
      if (err instanceof Error && err.name === "NotFoundError") {
        await createAnnexBranch()
      }
    }
    for (const line of uuidLog.split(/\n/)) {
      if (line.includes(expectedRemote)) {
        const endUuid = line.indexOf(" ")
        uuid = line.slice(0, endUuid)
      }
    }
    if (uuid) {
      // Add a remote.log entry if one does not exist
      let remoteLog = ""
      const newRemoteLog =
        `${uuid} autoenable=true name=openneuro type=external externaltype=openneuro encryption=none url=${context.repoEndpoint}\n`
      try {
        remoteLog = await context.fs.promises.readFile(
          join(context.repoPath, "remote.log"),
          { encoding: "utf8" },
        )
      } catch (_err) {
        // Continue if the error is remote.log is not found, otherwise throw it here
        if (
          !(_err instanceof Error && "code" in _err && _err.code === "ENOENT")
        ) {
          throw _err
        }
      } finally {
        // Add this remote if it's not already in remote.log
        if (!remoteLog.includes(uuid)) {
          // Continue if there's any errors and create remote.log
          await context.fs.promises.writeFile(
            join(context.repoPath, "remote.log"),
            newRemoteLog + remoteLog,
          )
          await git.add({ ...context.config(), filepath: "remote.log" })
        }
      }
      // Add logs for each annexed file
      for (const [key, _path] of Object.entries(annexKeys)) {
        const hashDir = join(...await hashDirLower(key))
        const annexBranchPath = join(hashDir, `${key}.log`)
        let log
        try {
          log = await readAnnexPath(annexBranchPath, context)
        } catch (err) {
          if (err instanceof Error && err.name === "NotFoundError") {
            logger.debug(`Annex branch object "${annexBranchPath}" not found`)
          } else {
            throw err
          }
        }
        if (log && log.includes(uuid)) {
          continue
        } else {
          const timestamp = (performance.timeOrigin + performance.now()) /
            1000.0
          const newAnnexLog = `${timestamp}s 1 ${uuid}\n${log ? log : ""}`
          await context.fs.promises.mkdir(join(context.repoPath, hashDir), {
            recursive: true,
          })
          await context.fs.promises.writeFile(
            join(context.repoPath, annexBranchPath),
            newAnnexLog,
          )
          await git.add({ ...context.config(), filepath: annexBranchPath })
        }
      }
      // Show a better commit message for when only the remote is updated
      if (Object.keys(annexKeys).length === 0) {
        // Only generate a commit if needed
        if (!remoteLog.includes(uuid)) {
          await git.commit({
            ...context.config(),
            message: "[OpenNeuro CLI] Configured remote",
            author: context.author,
          })
        }
      } else {
        await git.commit({
          ...context.config(),
          message: "[OpenNeuro CLI] Added annexed objects",
          author: context.author,
        })
      }
    }
  } finally {
    const defaultBranch = await getDefault(context)
    await git.checkout({
      ...context.config(),
      ref: defaultBranch,
    })
  }
}

/**
 * `git commit` equivalent
 */
async function commit() {
  const options = context.config()
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
      author: context.author,
      message: "[OpenNeuro] Added local files",
    })
    await commitAnnexBranch(annexKeys)
    logger.info(`Committed as "${commitHash}"`)
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

  // Update git-annex branch first
  const localAnnexOid = await git.resolveRef({
    ...context.config(),
    ref: "git-annex",
  })
  let remoteAnnexOid
  try {
    remoteAnnexOid = await git.resolveRef({
      ...context.config(),
      ref: "refs/remotes/origin/git-annex",
    })
  } catch (err) {
    if (err instanceof Error && err.name === "NotFoundError") {
      logger.info("Remote git-annex branch not found, pushing")
      remoteAnnexOid = null
    } else {
      throw err
    }
  }

  if (localAnnexOid === remoteAnnexOid) {
    logger.info("Git-annex branch is up to date.")
  } else {
    logger.info("Pushing git-annex branch...")
    // Git push git-annex
    await git.push(
      { ...context.config(), ref: "git-annex" },
    )
  }

  // Check if remote HEAD matches local HEAD
  const remoteRef = `refs/remotes/origin/${await getDefault(context)}`
  const localHeadOid = await git.resolveRef({
    ...context.config(),
    ref: "HEAD",
  })
  let remoteHeadOid
  try {
    remoteHeadOid = await git.resolveRef({
      ...context.config(),
      ref: remoteRef,
    })
  } catch (err) {
    // If the remote ref doesn't exist, it means the remote is empty or
    // the branch hasn't been pushed yet, so we should push.
    if (err instanceof Error && err.name === "NotFoundError") {
      logger.info("Remote branch not found, pushing")
      remoteHeadOid = null
    } else {
      throw err
    }
  }

  if (localHeadOid === remoteHeadOid) {
    console.log("No changes found for upload.")
  } else {
    console.log("Pushing changes...")
    // Git push
    await git.push(
      context.config(),
    )
    const url = new URL(context.repoEndpoint)
    console.log(
      `Upload complete, visit your dataset at ${url.protocol}//${url.host}/datasets/${context.datasetId}`,
    )
  }
}

// Queue of tasks to perform in order
const workQueue = new PromiseQueue()

// @ts-ignore Expected for workers
self.onmessage = (event: GitWorkerEvent) => {
  if (event.data.command === "setup") {
    context = new GitWorkerContext(
      event.data.datasetId,
      event.data.sourcePath,
      event.data.repoPath,
      event.data.repoEndpoint,
      event.data.authorization,
      event.data.name,
      event.data.email,
    )
    setupLogging(event.data.logLevel)
  } else if (event.data.command === "clone") {
    workQueue.enqueue(update)
  } else if (event.data.command === "add") {
    workQueue.enqueue(add, event)
  } else if (event.data.command === "commit") {
    workQueue.enqueue(commit)
  } else if (event.data.command === "push") {
    workQueue.enqueue(push)
  } else if (event.data.command === "remote-setup") {
    workQueue.enqueue(remoteSetup)
  } else if (event.data.command === "done") {
    workQueue.enqueue(done)
  }
}
