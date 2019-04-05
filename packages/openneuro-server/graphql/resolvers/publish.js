import config from '../../config'
import request from 'superagent'
import { updatePublic } from '../../datalad/dataset.js'
import { checkDatasetWrite } from '../permissions.js'
import { generateDataladCookie } from '../../libs/authentication/jwt'

export const publishDataset = (obj, { datasetId }, { user, userInfo }) => {
  return checkDatasetWrite(datasetId, user, userInfo).then(async () => {
    await updatePublic(datasetId, true)
    const uri = `${config.datalad.uri}/datasets/${datasetId}/publish`
    return await request
      .post(uri)
      .set('Cookie', generateDataladCookie(config)(user))
      .then(() => true)
  })
}
