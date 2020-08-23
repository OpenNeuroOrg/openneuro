import config from '../../config'
import request from 'superagent'
import { updatePublic } from '../../datalad/dataset.js'
import { checkDatasetWrite } from '../permissions.js'
import { generateDataladCookie } from '../../libs/authentication/jwt'
import { getDatasetWorker } from '../../libs/datalad-service'

export const publishDataset = (obj, { datasetId }, { user, userInfo }) => {
  return checkDatasetWrite(datasetId, user, userInfo).then(async () => {
    await updatePublic(datasetId, true)
    const uri = `${getDatasetWorker(datasetId)}/datasets/${datasetId}/publish`
    return await request
      .post(uri)
      .set('Cookie', generateDataladCookie(config)(userInfo))
      .then(() => true)
  })
}
