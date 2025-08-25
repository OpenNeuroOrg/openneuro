import { join } from "@std/path/join"
import type { GitWorkerContext } from "./types/git-context.ts"
import { default as git } from "isomorphic-git"

// Status Matrix Row Indexes
const FILEPATH = 0
const HEAD = 1
const WORKDIR = 2
const STAGE = 3

/**
 * Ensure clean worktree state before updates
 */
export async function resetWorktree(context: GitWorkerContext, branch: string) {
  // Status Matrix State
  const UNCHANGED = 1

  const allFiles = await git.statusMatrix(context.config())
  // Get all files which have been modified or staged - does not include new untracked files or deleted files
  const modifiedFiles = allFiles
    .filter((row) => row[WORKDIR] > UNCHANGED || row[STAGE] > UNCHANGED)
    .map((row) => row[FILEPATH])

  // Delete modified/staged files
  await Promise.all(
    modifiedFiles.map((path) =>
      context.fs.promises.rm(join(context.repoPath, path))
    ),
  )

  await git.checkout({ ...context.config(), ref: branch })
}
