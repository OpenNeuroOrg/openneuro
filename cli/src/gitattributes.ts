/**
 * Git annex supports many backends, we support a limited subset used by OpenNeuro (for now)
 * https://git-annex.branchable.com/backends/
 */
enum SupportedAnnexBackends {
  MD5E = "MD5E",
  SHA256E = "SHA256E",
}

/**
 * Annex attributes for one path
 */
interface GitAnnexAttributeOptions {
  largefiles?: number
  backend?: SupportedAnnexBackends
}

/**
 * Minimal parsing of .gitattributes for uploader usage
 */
type GitAnnexAttributes = Record<string, GitAnnexAttributeOptions>

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
    attributesObject[prefix] = {}
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
        attributesObject[prefix].backend = value as SupportedAnnexBackends
      }
    }
  }
  return attributesObject
}
