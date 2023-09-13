import { description } from './description.js'

export async function datasetType(dsOrSnapshot): Promise<'schema' | 'legacy'> {
  const dsDescription = await description(dsOrSnapshot)
  return dsDescription.DatasetType === 'derivative' ? 'schema' : 'legacy'
}
