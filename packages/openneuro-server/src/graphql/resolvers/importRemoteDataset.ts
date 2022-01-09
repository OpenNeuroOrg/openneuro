import IngestDataset from '../../models/ingestDataset'
import { checkDatasetWrite } from '../permissions.js'

/**
 * Queue a bundle of files for import into an existing dataset
 */
export async function importRemoteDataset(
  _: Record<string, unknown>,
  { datasetId, url }: { datasetId: string; url: string },
  { user, userInfo }: { user: string; userInfo: Record<string, unknown> },
): Promise<boolean> {
  await checkDatasetWrite(datasetId, user, userInfo)
  const ingest = new IngestDataset({ datasetId, url, userId: user })
  if (ingest.validateSync()) {
    return true
  } else {
    return false
  }
}
