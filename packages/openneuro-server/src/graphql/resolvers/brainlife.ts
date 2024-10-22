import { getDatasetFromSnapshotId } from "../../utils/datasetOrSnapshot"
import type { DatasetOrSnapshot } from "../../utils/datasetOrSnapshot"

interface BrainlifeFindQuery {
  removed: boolean
  path?: {
    $regex: string
  }
  version?: string
}

/**
 * Construct a query to check if a dataset or snapshot exists on Brainlife
 */
export function brainlifeQuery(dataset: DatasetOrSnapshot): URL {
  const find: BrainlifeFindQuery = {
    removed: false,
  }

  if ("tag" in dataset) {
    find.path = {
      $regex: `^OpenNeuro/${getDatasetFromSnapshotId(dataset.id)}`,
    }
    find.version = dataset.tag
  } else {
    find.path = { $regex: `^OpenNeuro/${dataset.id}` }
  }

  const url = new URL("https://brainlife.io/api/warehouse/datalad/datasets")
  url.searchParams.append("find", JSON.stringify(find))

  return url
}

/**
 * Make a request to Brainlife to check if a dataset exists
 */
export const onBrainlife = async (
  dataset: DatasetOrSnapshot,
): Promise<boolean> => {
  try {
    const abortController = new AbortController()
    const url = brainlifeQuery(dataset)
    const timeout = setTimeout(() => abortController.abort(), 5000)
    const res = await fetch(url.toString(), { signal: abortController.signal })
    clearTimeout(timeout)
    const body = await res.json()
    if (Array.isArray(body) && body.length) {
      return true
    } else {
      return false
    }
  } catch (err) {
    return false
  }
}
