import fetch from 'node-fetch'
import IngestDataset from '../../models/ingestDataset'
import { checkDatasetWrite } from '../permissions.js'
import { getDatasetWorker } from '../../libs/datalad-service'
import { generateDataladCookie } from '../../libs/authentication/jwt'
import config from '../../config'

/**
 * Queue a bundle of files for import into an existing dataset
 */
export async function importRemoteDataset(
  _: Record<string, unknown>,
  { datasetId, url }: { datasetId: string; url: string },
  { user, userInfo }: { user: string; userInfo: Record<string, unknown> },
): Promise<string | null> {
  console.log(`import request for ${url} by ${JSON.stringify(userInfo)}`)
  await checkDatasetWrite(datasetId, user, userInfo)
  const ingest = new IngestDataset({ datasetId, url, userId: user })
  // undefined validateSync() means no errors
  if (ingest.validateSync() == undefined) {
    await ingest.save()
    const importId = ingest._id.toString()
    const worker = getDatasetWorker(datasetId)
    const importUrl = `http://${worker}/datasets/${datasetId}/import/${importId}`
    await fetch(importUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: generateDataladCookie(config)(userInfo),
      },
      body: JSON.stringify({ url }),
    })
    return ingest._id.toString()
  } else {
    return
  }
}

export async function finishImportRemoteDataset(
  _: Record<string, unknown>,
  { id }: { id: string },
  { user, userInfo }: { user: string; userInfo: Record<string, unknown> },
): Promise<boolean> {
  const ingest = await IngestDataset.findById(id)
  ingest.imported = true
  await ingest.save()
  // TODO - Send the notification here
  return true
}
