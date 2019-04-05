/**
 * Takes an array of files and returns a tree representation
 * @param {array} files
 */
export const flatToTree = files => {
  const tree = { name: '', files: [], directories: [] }
  for (const file of files) {
    const pathTokens = file.filename.split('/')
    const lastPath = pathTokens.slice(-1).pop()
    if (pathTokens.length === 1) {
      // Top level file
      tree.files.push({ ...file })
    } else {
      // File in a directory
      let directory = tree
      for (const token of pathTokens) {
        if (token === lastPath) {
          // Leaf (file)
          directory.files.push({
            ...file,
            filename: lastPath,
          })
        } else {
          const newDir = directory.directories.find(dir => dir.name === token)
          if (newDir) {
            // Already exists, keep going
            directory = newDir
          } else {
            // Create the missing directory
            const createDir = {
              name: token,
              path: `${(directory.path && directory.path + ':') || ''}${token}`,
              files: [],
              directories: [],
            }
            directory.directories.push(createDir)
            directory = createDir
          }
        }
      }
      tree.directories
    }
  }
  return tree
}
