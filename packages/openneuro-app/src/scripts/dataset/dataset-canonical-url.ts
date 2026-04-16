import { config } from "../config"

export function datasetCanonicalUrl(dataset): URL {
  const siteUrl = config.url
  if (dataset.snapshots.length) {
    const latestSnapshot = dataset.snapshots.slice(-1)[0]
    return new URL(
      `/datasets/${dataset.id}/versions/${latestSnapshot.tag}`,
      siteUrl,
    )
  } else {
    return new URL(`/datasets/${dataset.id}`, siteUrl)
  }
}
