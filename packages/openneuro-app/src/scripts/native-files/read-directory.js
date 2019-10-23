/**
 * Ask the user to select a directory and return entries
 */
export const readDirectory = async () => {
  const opts = { type: 'openDirectory' }
  const handle = await window.chooseFileSystemEntries(opts)
  return handle.getEntries()
}
