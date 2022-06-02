import fetch from 'node-fetch'
import {
  DatasetOrSnapshot,
  getDatasetFromSnapshotId,
} from '../../utils/datasetOrSnapshot'

const S3_BUCKET = 'openneuro-derivatives'
const GITHUB_ORGANIZATION = 'OpenNeuroDerivatives'

// Available derivatives at this time
type GitHubDerivative = 'mriqc' | 'fmriprep'

/**
 * Test for a derivative on GitHub via API
 * @param datasetId
 * @param derivative String identifying the kind of derivative
 */
export const githubDerivativeQuery = (
  datasetId: string,
  derivative: GitHubDerivative,
): URL => {
  const url = new URL(
    `https://api.github.com/repos/${GITHUB_ORGANIZATION}/${datasetId}-${derivative}`,
  )
  return url
}

export const githubDerivative = async (
  datasetId: string,
  derivative: GitHubDerivative,
): Promise<boolean> => {
  try {
    const url = githubDerivativeQuery(datasetId, derivative)
    const res = await fetch(url.toString())
    if (res.status === 200) {
      const body = await res.json()
      // Verify we aren't displaying a hidden repo
      if (!body.private) {
        return true
      }
    }
    return false
  } catch (err) {
    return false
  }
}

interface DatasetDerivatives {
  name: string
  local: boolean
  s3Url: URL
  dataladUrl: URL
}

export const derivativeObject = (
  datasetId: string,
  derivative: GitHubDerivative,
): DatasetDerivatives => {
  const name = `${datasetId}-${derivative}`
  return {
    name,
    // Always false to identify OpenNeuro hosted derivatives later
    local: false,
    s3Url: new URL(name, `s3://${S3_BUCKET}/${derivative}/`),
    dataladUrl: new URL(
      `${name}.git`,
      `https://github.com/${GITHUB_ORGANIZATION}/`,
    ),
  }
}

/**
 * Derivative resolver, returns an array of the available derivative dataset sources
 */
export const derivatives = async (
  dataset: DatasetOrSnapshot,
): Promise<Array<DatasetDerivatives>> => {
  let datasetId
  if ('tag' in dataset) {
    datasetId = getDatasetFromSnapshotId(dataset.id)
  } else {
    datasetId = dataset.id
  }
  const available: Array<DatasetDerivatives> = []
  if (await githubDerivative(datasetId, 'mriqc')) {
    available.push(derivativeObject(datasetId, 'mriqc'))
  }
  if (await githubDerivative(datasetId, 'fmriprep')) {
    available.push(derivativeObject(datasetId, 'fmriprep'))
  }
  return available
}
