import { Readable } from 'stream'
import JSZip from 'jszip'

/**
 * Return a streaming zip from array of file objects
 * @param {Array} files Array of files to fetch
 */
export const zipFiles = ({ files }) => {
  const zip = new JSZip()

  // Start getting files, in order
  for (const { filename, urls } of files) {
    const readStream = new Readable()
    let reader
    readStream._read = () => {
      reader = reader || fetchAlternates(urls).then(res => res.body.getReader())
      reader.then(reader =>
        reader
          .read()
          .then(({ value, done }) =>
            readStream.push(done ? null : new Buffer(value)),
          ),
      )
    }
    zip.file(filename, readStream)
  }

  // Build a ReadableStream for fetch
  return new ReadableStream({
    start(controller) {
      zip
        .generateInternalStream({ type: 'uint8array', streamFiles: true })
        .on('data', data => {
          controller.enqueue(data)
        })
        .on('error', err => {
          // eslint-disable-next-line no-console
          console.log(err)
        })
        .on('end', () => controller.close())
        .resume()
    },
  })
}

/**
 * Check each URL provided
 * @param {Array} urls
 */
const fetchAlternates = urls => {
  if (urls.length > 0) {
    const fileUrl = urls.shift()
    return fetch(fileUrl, { method: 'HEAD' }).then(
      response => (response.ok ? fetch(fileUrl) : fetchAlternates(urls)),
    )
  } else {
    throw new Error('All file URLs failed.')
  }
}

/**
 * Create a zipped response for an Dataset FetchEvent
 * @param {URL} index The URL for a file index (s3 and other files)
 */
export const bundleResponse = async index => {
  let filename = 'archive'
  const tokens = index.pathname.split('/')
  const tl = tokens.length
  // If this is a draft download
  if (tokens[tl - 3] === 'datasets') {
    // Set filename to the accession number
    filename = tokens[tl - 2]
  } else if (tokens[tl - 3] === 'snapshots') {
    // Accession number + snapshot
    filename = `${tokens[tl - 4]}-${tokens[tl - 2]}`
  }
  const headers = {
    'Content-Type': 'application/zip',
    'Content-Disposition': `attachment; filename="${filename}.zip"`,
  }
  return new Response(
    await fetch(index)
      .then(resp => resp.json())
      .then(zipFiles),
    { headers },
  )
}
