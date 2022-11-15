import { vi } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'
import MemoryFs from 'metro-memory-fs'
import { getConfig, saveConfig, getToken } from '../config'

vi.mock('fs', () => new MemoryFs())
const HOME = os.homedir()

beforeEach(async () => {
  fs.reset()
  const mkdirp = await vi.importActual('mkdirp')
  mkdirp.sync(HOME)
})

describe('config.js', () => {
  it('should find a config file if one exists', () => {
    const mockPath = path.join(HOME, '.openneuro')
    fs.writeFileSync(mockPath, JSON.stringify({}))
    expect(getConfig()).not.toBeNull()
  })
  it('fails if no config file exists', () => {
    expect(getConfig()).toBeNull()
  })
  it('saves a configuration in the right location', () => {
    const testConfig = { testing: true }
    saveConfig(testConfig)
    expect(getConfig()).not.toBeNull()
  })
  describe('getToken', () => {
    it('should return a token if one is configured', () => {
      const token = '123456'
      const mockPath = path.join(HOME, '.openneuro')
      fs.writeFileSync(mockPath, JSON.stringify({ apikey: token }))
      expect(getToken()).toBe(token)
    })
    it('should throw an error if one is not configured', () => {
      const mockPath = path.join(HOME, '.openneuro')
      fs.writeFileSync(mockPath, JSON.stringify({}))
      expect(() => getToken()).toThrow()
    })
  })
})
