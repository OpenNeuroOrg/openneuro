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
    // TODO - Streaming here needs some work, fetch the whole file for now
    zip.file(key, (await stream).blob())
  }
  return zip.generateAsync({ type: 'blob', streamFiles: true })
}
