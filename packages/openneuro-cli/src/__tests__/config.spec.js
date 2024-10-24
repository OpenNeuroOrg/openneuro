import fs from "fs"
import os from "os"
import path from "path"
import { getConfig, getToken, saveConfig } from "../config"

const HOME = `${os.homedir()}`

vi.mock("fs", () => {
  return {
    /* eslint-disable-next-line */
    default: new (require("metro-memory-fs"))({
      cwd: () => HOME,
    }),
  }
})

beforeEach(async () => {
  fs.reset()
  // Create home path based on OS inside the memory fs
  let paths = ""
  for (const level of HOME.substring(1).split(path.sep)) {
    paths = `${paths}${path.sep}${level}`
    fs.mkdirSync(paths)
  }
})

describe("config.js", () => {
  it("should find a config file if one exists", () => {
    const mockPath = path.join(HOME, ".openneuro")
    fs.writeFileSync(mockPath, JSON.stringify({}))
    expect(getConfig()).not.toBeNull()
  })
  it("fails if no config file exists", () => {
    expect(getConfig()).toBeNull()
  })
  it("saves a configuration in the right location", () => {
    const testConfig = { testing: true }
    saveConfig(testConfig)
    expect(getConfig()).not.toBeNull()
  })
  describe("getToken", () => {
    it("should return a token if one is configured", () => {
      const token = "123456"
      const mockPath = path.join(HOME, ".openneuro")
      fs.writeFileSync(mockPath, JSON.stringify({ apikey: token }))
      expect(getToken()).toBe(token)
    })
    it("should throw an error if one is not configured", () => {
      const mockPath = path.join(HOME, ".openneuro")
      fs.writeFileSync(mockPath, JSON.stringify({}))
      expect(() => getToken()).toThrow()
    })
  })
})
