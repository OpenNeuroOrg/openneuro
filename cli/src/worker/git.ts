// Might be useful if this is shared by the browser uploader at some point
import "https://deno.land/x/indexeddb@1.3.5/polyfill.ts"
import LightningFS from "https://esm.sh/@isomorphic-git/lightning-fs@4.6.0"
import git from "https://esm.sh/isomorphic-git@1.25.3"
import http from "https://esm.sh/isomorphic-git@1.25.3/http/node"
//import fs from "node:fs"

const context = {
  // Current working dataset
  datasetId: undefined,
  // The path being uploaded from to OpenNeuro
  sourcePath: undefined,
  // The path of our local clone (possibly in virtual fs)
  repoPath: undefined,
  // URL for the remote git repo
  repoEndpoint: undefined,
  // OpenNeuro git access short lived API key
  authorization: undefined,
  fs: undefined,
  // setContext has been called at least once
  initialized: false,
}

self.addEventListener("unhandledrejection", (e) => {
  console.log(e.reason)
  console.log(e.reason.stack)
  e.preventDefault()
})

self.onmessage = async (event) => {
  if (event.data.command === "setContext") {
    context.datasetId = event.data.datasetId
    context.sourcePath = event.data.sourcePath
    context.repoPath = event.data.repoPath
    context.repoEndpoint = event.data.repoEndpoint
    context.authorization = event.data.authorization
    context.fs = new LightningFS(context.datasetId)
    context.initialized = true
  } else if (event.data.command === "clone") {
    await git.clone({
      fs: context.fs,
      http,
      dir: context.repoPath,
      url: event.data.url,
      singleBranch: true,
      depth: 1,
      headers: {
        Authorization: context.authorization,
      },
    })
  } else if (event.data.command === "add") {
    console.log(event.data.path)
  } else if (event.data.command === "close") {
    globalThis.close()
  }
}
