import fs from 'fs'
import path from 'path'

export const streamFiles = root => files =>
  Promise.all(
    files.map(file => {
      const absoluteRoot = path.resolve(root)
      const absolutePath = path.join(file.root, file.name)
      const relativePath = path.relative(absoluteRoot, absolutePath)
      return {
        stream: fs.createReadStream(absolutePath),
        absolutePath,
        relativePath,
      }
    }),
  )
