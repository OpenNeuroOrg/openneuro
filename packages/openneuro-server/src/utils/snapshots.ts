import semver from "semver"

export const snapshotCreationComparison = (
  { created: a, tag: a_tag }: { created: string | number; tag: string },
  { created: b, tag: b_tag }: { created: string | number; tag: string },
) => {
  if (semver.valid(a_tag) && semver.valid(b_tag)) {
    return semver.compare(a_tag, b_tag)
  } else {
    if (typeof a === "number" && typeof b === "number") {
      return new Date(a * 1000).getTime() - new Date(b * 1000).getTime()
    } else {
      return new Date(a).getTime() - new Date(b).getTime()
    }
  }
}
