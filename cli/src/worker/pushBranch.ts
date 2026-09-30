import { default as git } from "isomorphic-git"
import type { Logger } from "@std/log"
import type { GitWorkerContext } from "./types/git-context.ts"

/** Retry a final branch push without repeating annex object transfers. */
export async function pushBranch(
  context: GitWorkerContext,
  logger: Logger,
  ref: string,
) {
  const attempts = 3
  for (let attempt = 1;; attempt += 1) {
    try {
      return await git.push({
        ...context.config(),
        ref,
        onMessage: console.log,
      })
    } catch (cause) {
      if (attempt === attempts) {
        throw new Error(
          `Failed to push "${ref}" after ${attempts} attempts. ` +
            `Successfully transferred annex objects remain stored on the remote. ` +
            `The local repository is at "${context.repoPath}".`,
          { cause },
        )
      }
      logger.warn(`Failed to push "${ref}" - retrying (${attempt}/${attempts})`)
    }
  }
}
