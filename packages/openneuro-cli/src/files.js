import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import progress from 'progress-stream'

const readdir = promisify(fs.readdir)

const progressFactory = filename => {
  return progress(
    {
      time: 1000,
    },
    status => {
      // eslint-disable-next-line no-console
      console.log(`Transferring "${filename}" - ${status.percentage}% complete`)
    },
  )
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
      files: stats.filter(({ stat }) => stat.isFile()).map(({ filePath }) => {
        const stream = fs.createReadStream(filePath)
        if (logging) {
          stream.pipe(progressFactory(filePath))
        }
        return stream
      }),
      directories: await Promise.all(
        // This is an array of each promise related to the next level in the tree
        stats
          .filter(({ stat }) => stat.isDirectory())
          .map(({ filePath }) => getFileTree(basepath, filePath)),
      ),
    }
  })
}
