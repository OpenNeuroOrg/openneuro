import config from "../../config"
import request from "superagent"
import { updatePublic } from "../../datalad/dataset"
import { checkDatasetWrite } from "../permissions.js"
import { generateDataladCookie } from "../../libs/authentication/jwt"
import { getDatasetWorker } from "../../libs/datalad-service"
import type { GraphQLContext } from "../builder"

export const publishDataset = (obj, { datasetId }, { user, userInfo }: GraphQLContext) => {
  return checkDatasetWrite(datasetId, user, userInfo).then(async () => {
    await updatePublic(datasetId, true, userInfo)
    const uri = `${getDatasetWorker(datasetId)}/datasets/${datasetId}/publish`
    return await request
      .post(uri)
      .set("Cookie", generateDataladCookie(config)(userInfo))
      .then(() => true)
  })
}
