import fs from 'fs'

/**
 * Creates an fs.ReadStream and extends it with lazy file opening
 * @param {string|Buffer|URL} path
 * @param {string|Object} options
 */
export function LazyReadStream(path, options) {
  // Set an invalid fd to skip the open call and signal to _read
  const readStream = fs.createReadStream(path, { ...options, fd: -128 })
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const realRead = readStream._read
  // eslint-disable-next-line @typescript-eslint/unbound-method
  readStream._read = function(size) {
    if (this.fd === -128) {
      // Open sync here
      try {
        this.fd = fs.openSync(this.path, this.flags, this.mode)
        this.emit('open', this.fd)
        this.emit('ready')
      } catch (er) {
        // Handle the regular error behavior if anything goes wrong
        if (this.autoClose) {
          this.destroy()
        }
        this.emit('error', er)
      }
    }
    realRead.call(this, size)
  }
  return readStream
}

/**
 * Equivalent to fs.createReadStream but opens on first read
 * @param {string|Buffer|URL} path
 * @param {string|Object} options
 */
export const createLazyReadStream = (path, options) =>
  new LazyReadStream(path, options)
