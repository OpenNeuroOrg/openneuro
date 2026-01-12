import http from "isomorphic-git/http/node/index.js"
import { decode } from "@wok/djwt"
import fs from "node:fs"
import type { LevelName } from "@std/log/levels"

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

export class GitWorkerContext {
  // Current working dataset ID
  constructor(
    public datasetId: string,
    // The path being uploaded from to OpenNeuro
    public sourcePath: string,
    // The path of our local clone (possibly in virtual fs)
    public repoPath: string,
    // URL for the remote git repo
    public repoEndpoint: string,
    // OpenNeuro git access short lived API key
    public authorization: string,
  ) {}

  /**
   * Return isomorphic config
   */
  config(dir?: string) {
    return {
      fs,
      http,
      dir: dir ? dir : this.repoPath,
      url: this.repoEndpoint,
      headers: {
        Authorization: `Bearer ${this.authorization}`,
      },
    }
  }

  /**
   * Get proxy for fs
   * TODO - Pick the right fs for the environment
   */
  get fs() {
    return fs
  }

  /**
   * Get proxy for http
   * TODO - Pick the right http for the environment
   */
  get http() {
    return http
  }

  get author(): { email: string; name: string } {
    const decodedToken = decode(this.authorization)
    const { email, name } = decodedToken[1] as OpenNeuroGitToken
    return { email, name }
  }
}

/**
 * Events with no arguments
 */
export interface GitWorkerEventGeneric {
  data: {
    command: "clone" | "commit" | "done" | "push"
  }
}

export interface GitWorkerEventSetupData extends GitWorkerContext {
  command: "setup"
  logLevel: LevelName
}

/** Setup event to set dataset and repo state for commands until next call */
export interface GitWorkerEventSetup {
  data: GitWorkerEventSetupData
}

/** Add event to add one file */
export interface GitWorkerEventAdd {
  data: {
    command: "add"
    // Absolute path on the local system
    path: string
    // Dataset relative path
    relativePath: string
  }
}

/** Clone event to clone or fetch a version */
export interface GitWorkerEventClone {
  data: {
    command: "clone"
    // Version to clone
    version?: string
  }
}

export interface GitWorkerEventRemoteSetup {
  data: {
    command: "remoteSetup"
    // Version to checkout after setup
    version?: string
  }
}

export type GitWorkerEvent =
  | GitWorkerEventSetup
  | GitWorkerEventGeneric
  | GitWorkerEventAdd
  | GitWorkerEventClone
  | GitWorkerEventRemoteSetup
