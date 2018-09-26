import fs from 'fs'
import path from 'path'
import moment from 'moment'
import stream from 'stream'
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

export const fileProgress = (console, relativePath, stream, size) => () => {
  const percentage = Math.round(100 * (stream.bytesRead / size))
  const remainingBytes = size - stream.bytesRead
  const remaining = remainingBytes
    ? `(${bytesToSize(remainingBytes)} remaining)`
    : ''
  console.log(
    `Transferring "${relativePath}" - ${percentage}% complete ${remaining}`,
  )
  return { percentage, remainingBytes }
}

export const getFileTree = (
  basepath,
  root,
  { remoteFiles, logging = true },
) => {
  return readdir(root).then(async contents => {
    // Run stat for each file
    const stats = contents.map(filePath => ({
      filePath: path.join(root, filePath),
      relativePath: path.join(path.relative(basepath, root), filePath),
      stat: fs.statSync(path.join(root, filePath)),
    }))
    // Divide into files and directories
    // Return streams for files, recurse for directories
    // Ignores all other file types (we do not handle them)
    return {
      name: path.relative(basepath, root),
      files: stats
        .filter(({ stat, relativePath }) => {
          // Only include files
          if (stat.isFile()) {
            // Remote file check enabled
            if (remoteFiles) {
              const remoteFile = remoteFiles.find(
                rFile => rFile.filename === relativePath,
              )
              // File exists remotely
              if (remoteFile) {
                // File is the same size
                if (remoteFile.size === stat.size) {
                  if (logging) {
                    // eslint-disable-next-line no-console
                    console.log(`Skipping existing file - "${relativePath}"`)
                  }
                  // Skip existing files
                  return false
                }
              }
            }
            // Include any other files
            return true
          } else {
            // Skip directories
            return false
          }
        })
        .map(({ stat, filePath, relativePath }) => {
          const stream = fs.createReadStream(filePath)
          stream.pause()
          if (logging) {
            stream.on(
              'data',
              debounce(
                fileProgress(console, relativePath, stream, stat.size),
                500,
              ),
            )
          }
          return stream
        }),
      directories: await Promise.all(
        // This is an array of each promise related to the next level in the tree
        stats
          .filter(({ stat }) => stat.isDirectory())
          .map(({ filePath }) =>
            getFileTree(basepath, filePath, { logging, remoteFiles }),
          ),
      ),
    }
  })
}

export const generateChanges = tree => {
  // Determine if the files list has a CHANGES file already
  const hasChanges =
    tree.files && tree.files.some(f => f.path.endsWith('CHANGES'))

  // Do nothing if the file already exists
  if (hasChanges) return tree

  // Construct the initial content of the CHANGES file
  const snapshotText = 'Initial snapshot'
  const date = moment().format('YYYY-MM-DD')
  const versionString = '1.0.0'
  const initialChangesContent = `\n${versionString}\t${date}\n\n\t- ${snapshotText}`

  // Create readable stream from the CHANGES file we have
  const initialChangesStream = new stream.PassThrough()
  initialChangesStream.end(new Buffer(initialChangesContent, 'utf-8'))
  initialChangesStream.path = 'CHANGES'

  // Add the readable stream to the root level files list (tree.files)
  tree.files.push(initialChangesStream)
  return tree
}
