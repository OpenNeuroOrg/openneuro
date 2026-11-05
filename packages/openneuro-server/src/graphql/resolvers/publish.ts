import config from "../../config"
import { updatePublic } from "../../datalad/dataset"
import { checkDatasetWrite } from "../permissions.js"
import { generateDataladCookie } from "../../libs/authentication/jwt"
import {
  assertWorkerResponse,
  discardWorkerResponse,
  getDatasetWorker,
} from "../../libs/datalad-service"
import type { GraphQLContext } from "../builder"

export const publishDataset = (
  obj,
  { datasetId },
  { user, userInfo }: GraphQLContext,
) => {
  return checkDatasetWrite(datasetId, user, userInfo).then(async () => {
    await updatePublic(datasetId, true, userInfo)
    const uri = `http://${
      getDatasetWorker(datasetId)
    }/datasets/${datasetId}/publish`
    const response = await fetch(uri, {
      method: "POST",
      headers: {
        Cookie: generateDataladCookie(config)(userInfo),
      },
    })
    await assertWorkerResponse(
      response,
      `Failed to publish dataset "${datasetId}"`,
    )
    await discardWorkerResponse(response)
    return true
  })
}
