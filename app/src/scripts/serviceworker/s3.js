/**
 * S3 helper functions in the service worker
 *
 * The AWS sdk is avoided to save on bundle size
 */
import xmldoc from 'xmldoc'
import { zipFiles } from './zip'

/**
 * Returns a promise of object keys within a bucket, filtered by prefix
 * @param {string} hostname An S3 bucket URL
 * @param {string} prefix The prefix to filter by
 */
export const listBucket = (hostname, prefix) => {
  return fetch(`http://${hostname}/?list-type=2&prefix=${prefix}`)
    .then(res => res.text())
    .then(getObjects(hostname))
}

/**
 * Helper function for finding the contents of an S3 listObjects query
 * @param {string} hostname
 * @param {string} listBucketBody Raw string containing XML body from listObjects
 * @returns {Promise} Resolves to Array([{key, size, url},...])
 */
export const getObjects = hostname => listBucketBody => {
  const doc = new xmldoc.XmlDocument(listBucketBody)
  return doc.childrenNamed('Contents').map(file => {
    // This is each key in the bucket found for the prefix
    const key = file.childNamed('Key').val
    return {
      key,
      size: file.childNamed('Size').val,
      url: `http://${hostname}/${key}`,
    }
  })
}

/**
 * Start fetching files from [{key, size, url}, ...] array
 * @param {Array} files
 * @returns {object} Body of the response
 */
export const fetchFiles = files => {
  return files.map(({ key, size, url }) => {
    console.log(`fetching file ${key} size ${size}`)
    return {
      key,
      stream: fetch(url),
    }
  })
}

/**
 * Create a zipped response for an S3 FetchEvent
 * @param {string} hostname An S3 bucket URL
 * @param {string} prefix The prefix to filter by
 */
export const zipResponse = async (hostname, prefix) => {
  const header = {
    'Content-Type': 'application/zip',
    'Content-Disposition': 'attachment; filename=archive.zip',
  }
  return new Response(
    await listBucket(hostname, prefix)
      .then(fetchFiles)
      .then(zipFiles),
    header,
  )
}
