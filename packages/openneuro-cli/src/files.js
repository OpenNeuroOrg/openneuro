import fs from 'fs'
import path from 'path'

export const streamFiles = files =>
  Promise.all(
    files.map(file => {
      const absolutePath = path.join(file.root, file.name)
      const stream = fs.createReadStream(absolutePath)
      return stream
    }),
  )
