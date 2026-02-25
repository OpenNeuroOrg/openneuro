import { default as git } from "isomorphic-git"
import type { GitWorkerContext } from "./types/git-context.ts"

export class CommitBuilder {
  private updates: Map<string, Uint8Array> = new Map()

  constructor(private context: GitWorkerContext) {}

  add(path: string, content: string | Uint8Array) {
    const data = typeof content === "string"
      ? new TextEncoder().encode(content)
      : content
    this.updates.set(path, data)
  }

  async commit(branch: string, message: string) {
    const options = this.context.config()
    let parentCommit
    let parentTree
    try {
      parentCommit = await git.resolveRef({ ...options, ref: branch })
      const commitObj = await git.readCommit({ ...options, oid: parentCommit })
      parentTree = commitObj.commit.tree
    } catch {
      // Branch might not exist or is empty
      parentCommit = undefined
      parentTree = undefined
    }

    const newTree = await this.buildTree(parentTree, this.updates)

    if (!newTree) {
      return undefined
    }

    const now = new Date()
    const timestamp = Math.floor(now.getTime() / 1000)
    const timezoneOffset = now.getTimezoneOffset()
    const author = {
      ...this.context.author,
      timestamp,
      timezoneOffset,
    }

    const commitOid = await git.writeCommit({
      ...options,
      commit: {
        message,
        tree: newTree,
        parent: parentCommit ? [parentCommit] : [],
        author,
        committer: author,
      },
    })

    await git.writeRef({
      ...options,
      ref: `refs/heads/${branch}`,
      value: commitOid,
      force: true,
    })

    return commitOid
  }

  private async buildTree(
    baseOid: string | undefined,
    updates: Map<string, Uint8Array>,
  ): Promise<string> {
    const options = this.context.config()
    let entries: {
      mode: string
      path: string
      oid: string
      type: "blob" | "tree" | "commit"
    }[] = []
    if (baseOid) {
      const treeResult = await git.readTree({ ...options, oid: baseOid })
      entries = treeResult.tree
    }

    // Group updates by current path segment
    const bySegment = new Map<string, Map<string, Uint8Array>>()
    const fileUpdates = new Map<string, Uint8Array>()

    for (const [path, content] of updates) {
      const parts = path.split("/")
      const segment = parts[0]
      if (parts.length === 1) {
        fileUpdates.set(segment, content)
      } else {
        if (!bySegment.has(segment)) {
          bySegment.set(segment, new Map())
        }
        bySegment.get(segment)!.set(parts.slice(1).join("/"), content)
      }
    }

    // Process subdirectories
    for (const [segment, childUpdates] of bySegment) {
      const existingEntryIndex = entries.findIndex((e) => e.path === segment)
      const existingEntry = existingEntryIndex >= 0
        ? entries[existingEntryIndex]
        : undefined

      const childBaseOid = existingEntry && existingEntry.type === "tree"
        ? existingEntry.oid
        : undefined

      const newChildOid = await this.buildTree(childBaseOid, childUpdates)

      const newEntry = {
        mode: "040000",
        path: segment,
        oid: newChildOid,
        type: "tree" as const,
      }

      if (existingEntryIndex >= 0) {
        entries[existingEntryIndex] = newEntry
      } else {
        entries.push(newEntry)
      }
    }

    // Process files
    for (const [filename, content] of fileUpdates) {
      const blobOid = await git.writeBlob({ ...options, blob: content })
      const newEntry = {
        mode: "100644",
        path: filename,
        oid: blobOid,
        type: "blob" as const,
      }

      const existingEntryIndex = entries.findIndex((e) => e.path === filename)
      if (existingEntryIndex >= 0) {
        entries[existingEntryIndex] = newEntry
      } else {
        entries.push(newEntry)
      }
    }

    return await git.writeTree({ ...options, tree: entries })
  }
}
