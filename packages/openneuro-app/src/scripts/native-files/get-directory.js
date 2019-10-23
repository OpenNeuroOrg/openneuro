export const getDirectoryHandle = () => {
  return window.chooseFileSystemEntries({ type: 'openDirectory' })
}
