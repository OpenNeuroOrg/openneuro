import ignore from "ignore"
/**
 * Git annex supports many backends, we support a limited subset used by OpenNeuro (for now)
 * https://git-annex.branchable.com/backends/
 */
export type GitAnnexBackend = "GIT" | "SHA256" | "SHA256E" | "MD5" | "MD5E"

/**
 * Annex attributes for one path
 */
export interface GitAnnexAttributeOptions {
  largefiles?: number
  backend?: GitAnnexBackend
  match: ignore.Ignore
}

/**
 * Minimal parsing of .gitattributes for uploader usage
 */
export type GitAnnexAttributes = Record<string, GitAnnexAttributeOptions>

/**
 * Parse any relevant annex options from .gitattributes
 * @param gitattributes A .gitattributes file in string format
 */
export function parseGitAttributes(gitattributes: string): GitAnnexAttributes {
  const attributesObject: GitAnnexAttributes = {}
  for (const line of gitattributes.split("\n")) {
    if (line.length < 3) {
      continue
    }
    const [prefix, ...rest] = line.split(" ")
    attributesObject[prefix] = {
      match: ignore.default().add(prefix),
    }
    for (const attr of rest) {
      const eqIndex = attr.indexOf("=")
      const key = attr.substring(0, eqIndex)
      const value = attr.substring(eqIndex + 1)
      if (key === "annex.largefiles") {
        if (value === "nothing") {
          attributesObject[prefix].largefiles = Infinity
        } else if (value === "anything") {
          attributesObject[prefix].largefiles = 0
        } else if (value.startsWith("largerthan=")) {
          const size = value.split("largerthan=")[1].toLowerCase()
          if (size.endsWith("kb")) {
            attributesObject[prefix].largefiles = Number(size.slice(0, -2)) *
              1024
          } else if (size.endsWith("mb")) {
            attributesObject[prefix].largefiles = Number(size.slice(0, -2)) *
              1024 * 1024
          } else if (size.endsWith("gb")) {
            attributesObject[prefix].largefiles = Number(size.slice(0, -2)) *
              1024 * 1024 * 1024
          } else if (size.endsWith("tb")) {
            attributesObject[prefix].largefiles = Number(size.slice(0, -2)) *
              1024 * 1024 * 1024 * 1024
          } else {
            attributesObject[prefix].largefiles = Number(size)
          }
        }
      } else if (key === "annex.backend") {
        attributesObject[prefix].backend = value as GitAnnexBackend
      }
    }
  }
  return attributesObject
}

interface MatchingAnnexAttributes {
  backend?: GitAnnexBackend
  largefiles?: number
}

/**
 * Return any matching values merged for a given path
 */
export function matchGitAttributes(
  attributes: GitAnnexAttributes,
  path: string,
) {
  const matching: MatchingAnnexAttributes = {}
  for (const [prefix, attr] of Object.entries(attributes)) {
    if (attr.match.test(path).ignored == true) {
      if ("backend" in attr) {
        matching.backend = attr.backend
      }
      if ("largefiles" in attr) {
        matching.largefiles = attr.largefiles
      }
    }
  }
  return matching
}
