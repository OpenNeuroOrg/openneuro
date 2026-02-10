import request from "superagent"
import { Readable } from "node:stream"
import mime from "mime-types"
import { getFiles } from "../datalad/files"
import { getDatasetEndpoint, getDatasetWorker } from "../libs/datalad-service"
import { getDraftRevision } from "../datalad/draft"

/**
 * Handlers for datalad dataset manipulation
 *
 * Access and caching is handled here so that it can be coordinated with other
 * web nodes independent of the DataLad service.
 *
 * Unlike the other handlers, these use superagent for performance reasons
 */

/**
 * Get a file from a dataset
 */
export const getFile = async (req, res) => {
  const { datasetId, snapshotId, filename } = req.params
  const worker = getDatasetWorker(datasetId)
  // Find the right tree
  const pathComponents = filename.split(":")
  // Get the draft commit for cache busting
  const draftCommit = await getDraftRevision(datasetId)
  let tree = snapshotId || draftCommit
  let file
  for (const level of pathComponents) {
    try {
      const files = await getFiles(datasetId, tree)
      if (level == pathComponents.slice(-1)) {
        file = files.find((f) => !f.directory && f.filename === level)
      } else {
        // This tree may exist but have no children
        if (files) {
          tree = files.find((f) => f.directory && f.filename === level).id
        }
      }
    } catch (err) {
      // ConnectTimeoutError is Node/Undici and TimeoutError is the standard DOMException name
      // "fetch failed" can mean the connection failed at setup (network is unavailable)
      if (
        err?.cause?.name === "ConnectTimeoutError" ||
        err?.name === "TimeoutError" ||
        err?.name === "TypeError" && err?.message.includes("fetch failed")
      ) {
        // Unreachable backend, forward this error
        // Usually this is the service restarting due to node migrations or upgrades
        res.status(503).send("Worker could not be reached")
        return
      } else {
        // Unknown error should bubble up
        throw err
      }
    }
  }
  // Get the file URL and redirect if external or serve if local
  if (file && file.urls[0].startsWith("https://s3.amazonaws.com/")) {
    res.redirect(file.urls[0])
  } else {
    // Serve the file directly
    res.set("Content-Type", mime.lookup(filename) || "application/octet-stream")
    const uri = snapshotId
      ? `http://${worker}/datasets/${datasetId}/snapshots/${snapshotId}/files/${filename}`
      : `http://${worker}/datasets/${datasetId}/files/${filename}`
    return fetch(uri)
      .then((r) => {
        // Set the content length (allow clients to catch HTTP issues better)
        res.setHeader("Content-Length", Number(r.headers.get("content-length")))
        if (r.status === 404) {
          res.status(404).send("Requested dataset or file cannot be found")
        } else {
          // @ts-expect-error https://github.com/denoland/deno/issues/19620
          Readable.fromWeb(r.body, { highWaterMark: 4194304 }).pipe(res)
        }
      })
      .catch((_err) => {
        res.status(500).send("Internal error transferring requested file")
      })
  }
}

/**
 * Request a git object from a dataset
 */
export const getObject = (req, res) => {
  const { datasetId, key } = req.params
  const worker = getDatasetWorker(datasetId)
  // Backend depends on git object or git-annex key
  if (key.length === 40) {
    const uri = `${worker}/datasets/${datasetId}/objects/${key}`
    res.set("Content-Type", "application/octet-stream")
    return request.get(uri).pipe(res)
  } else if (key.startsWith("SHA256E-") || key.startsWith("MD5E-")) {
    const uri = `${worker}/datasets/${datasetId}/annex/${key}`
    res.set("Content-Type", "application/octet-stream")
    return request.get(uri).pipe(res)
  } else {
    res.set("Content-Type", "application/json")
    res.status(400).send({
      error: "Key must be a git object hash or git-annex key",
    })
  }
}

/**
 * Redirect to the appropriate git endpoint for a dataset
 */
export function gitRepo(req, res) {
  const { datasetId } = req.params
  const worker = getDatasetEndpoint(datasetId)
  const newUrl = req.originalUrl.replace(
    `${req.baseUrl}/git/`,
    `/git/${worker}/`,
  )
  return res.redirect(301, newUrl)
}
