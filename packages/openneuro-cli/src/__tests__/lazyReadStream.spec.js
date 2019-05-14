import fs from 'fs'
import { createLazyReadStream } from '../lazyReadStream.js'

describe('lazyReadStream', () => {
  it('returns a fs.ReadStream proxy', () => {
    const readStream = createLazyReadStream('package.json')
    expect(readStream instanceof fs.ReadStream).toBe(true)
  })
  it('does not call createReadStream before read', () => {
    const readStream = createLazyReadStream('package.json')
    expect(readStream.fd).toBe(-128)
  })
  it('calls createReadStream after read', async done => {
    const readStream = createLazyReadStream('package.json')
    expect(readStream.fd).toBe(-128)
    await readStream.read(10)
    expect(readStream.fd).not.toBe(-128)
    done()
  })
})
