/**
 * Streaming zip support
 */
import JSZip from 'jszip'

/**
 * Return a streaming zip files of the input stream
 * @param {Array} namedStreams Array of [{key: string, stream: ReadableStream}, ...]
 */
export const zipFiles = async namedStreams => {
  const zip = new JSZip()
  for (const { key, stream } of namedStreams) {
    // TODO - Streaming here needs some work - fetch the whole file for now...
    const res = await stream
    const arrayBuffer = await res.arrayBuffer()
    console.log(`${key} added`, arrayBuffer)
    zip.file(key, await arrayBuffer)
  }
  return zip.generateAsync({ type: 'blob', streamFiles: true })
}
