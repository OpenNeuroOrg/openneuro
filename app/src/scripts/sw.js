/**
 * Service worker entry point
 *
 * Be careful to only include necessary dependencies here
 */
import yazl from 'yazl'
import xmldoc from 'xmldoc'
import packageJson from '../../package.json'
const CACHE_NAME = `openneuro-${packageJson.version}`
const CACHE_PATHS = serviceWorkerOption.assets

self.addEventListener('install', event => {
  // TODO - remove console messages
  console.log('installed')
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHE_PATHS)
    }),
  )
})

const listBucket = (hostname, prefix) => {
  return fetch(`http://${hostname}/?list-type=2&prefix=${prefix}`)
}

const getObjects = body => {
  const doc = new xmldoc.XmlDocument(body)
  return doc.childrenNamed('Contents').map(file => {
    // This is each key in the bucket found for the prefix
    return {
      key: file.childNamed('Key').val,
      size: file.childNamed('Size').val,
    }
  })
}

const getFiles = hostname => files => {
  // Copy files to indexdb
  return files.map(({ key, size }) => {
    console.log(`fetching file size ${size}`)
    return fetch(`http://${hostname}/${key}`).then(res => res.body.getReader())
  })
}

const concatFiles = streams => {
  const zip = new yazl.ZipFile()
  zip.addBuffer(new Buffer('test'), 'test.txt')
  zip.end()
  return zip.outputStream
}

self.addEventListener('fetch', event => {
  // Let the browser do its default thing
  // for non-GET requests.
  if (event.request.method !== 'GET') {
    return
  } else {
    const url = new URL(event.request.url)
    const awsHostname = '.s3.amazonaws.com'
    if (url.hostname.endsWith(awsHostname)) {
      const header = {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename=archive.zip',
      }
      event.respondWith(
        (async function() {
          return new Response(
            await listBucket(url.hostname, url.pathname.slice(1))
              .then(res => res.text())
              .then(getObjects)
              .then(getFiles(url.hostname))
              .then(concatFiles),
            header,
          )
        })(),
      )
    } else {
      return
    }
  }
})
