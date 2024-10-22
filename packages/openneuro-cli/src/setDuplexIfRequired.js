/**
 * Duplex argument is required for Node 18.13.0 and 19.1.0 or later, but not supported at all earlier
 */
export function setDuplexIfRequired(version, requestOptions) {
  const m = version.match(/(\d+)\.(\d+)\.(\d+)/)
  const [major, minor, _patch] = m.slice(1).map((_) => parseInt(_))
  if ((major >= 18 && minor >= 13) || (major >= 19 && minor >= 1)) {
    requestOptions.duplex = "half"
  }
}
