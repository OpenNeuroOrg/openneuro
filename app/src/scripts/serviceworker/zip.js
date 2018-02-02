/**
 * Streaming zip support
 */
import jszip from 'jszip'

export const zipFiles = namedStreams => {
  const zip = new jszip()
  namedStreams.forEach(({ key, stream }) => {
    zip.file(key, stream, { binary: true })
    console.log(`${key} added`, stream)
  })
  return zip.generateAsync({ type: 'blob', streamFiles: true })
}
