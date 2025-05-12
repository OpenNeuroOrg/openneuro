import { default as git } from "isomorphic-git"
import type { GitContext } from "./types/git-context.ts"

/**
 * Determine if the default branch is main or master
 */
export async function getDefault(context: GitContext): Promise<string> {
  try {
    await git.resolveRef({ ...context.config(), ref: "main" })
    return "main"
  } catch (_err) {
    try {
      await git.resolveRef({ ...context.config(), ref: "master" })
      return "master"
    } catch (_err) {
      throw new Error("Could not determine default branch")
    }
  }
}
