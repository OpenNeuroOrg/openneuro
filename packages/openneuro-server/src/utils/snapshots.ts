import semver from "semver"

export const snapshotCreationComparison = (
  { created: a, tag: a_tag }: { created: Date | string; tag: string },
  { created: b, tag: b_tag }: { created: Date | string; tag: string },
) => {
  if (semver.valid(a_tag) && semver.valid(b_tag)) {
    return semver.compare(a_tag, b_tag)
  } else {
    return new Date(a).getTime() - new Date(b).getTime()
  }
}
