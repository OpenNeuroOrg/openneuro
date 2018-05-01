import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { debounce } from './utils'

const readdir = promisify(fs.readdir)

const bytesToSize = bytes => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return 'n/a'
  const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))), 10)
  if (i === 0) return `${bytes} ${sizes[i]})`
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`
}

export const fileProgress = (console, filename, stream, size) => () => {
  const percentage = Math.round(100 * (stream.bytesRead / size))
  const remainingBytes = size - stream.bytesRead
  const remaining = remainingBytes
    ? `(${bytesToSize(remainingBytes)} remaining)`
    : ''
  console.log(
    `Transferring "${filename}" - ${percentage}% complete ${remaining}`,
  )
  return { percentage, remainingBytes }
}

export const getFileTree = (basepath, root, logging = true) => {
  return readdir(root).then(async contents => {
    // Run stat for each file
    const stats = contents.map(filePath => ({
      filePath: path.join(root, filePath),
      stat: fs.statSync(path.join(root, filePath)),
    }))
    // Divide into files and directories
    // Return streams for files, recurse for directories
    // Ignores all other file types (we do not handle them)
    return {
      name: path.relative(basepath, root),
      files: stats
        .filter(({ stat }) => stat.isFile())
        .map(({ stat, filePath }) => {
          const stream = fs.createReadStream(filePath)
          if (logging) {
            stream.on(
              'readable',
              debounce(fileProgress(console, filePath, stream, stat.size), 500),
            )
          }
          return stream
        }),
      directories: await Promise.all(
        // This is an array of each promise related to the next level in the tree
        stats
          .filter(({ stat }) => stat.isDirectory())
          .map(({ filePath }) => getFileTree(basepath, filePath, logging)),
      ),
    }
  })
}
