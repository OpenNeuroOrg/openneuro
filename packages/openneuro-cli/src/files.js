import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readdir = promisify(fs.readdir)

export const getFileTree = (basepath, root) => {
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
        .map(({ filePath }) => fs.createReadStream(filePath)),
      directories: await Promise.all(
        // This is an array of each promise related to the next level in the tree
        stats
          .filter(({ stat }) => stat.isDirectory())
          .map(({ filePath }) => getFileTree(basepath, filePath)),
      ),
    }
  })
}
