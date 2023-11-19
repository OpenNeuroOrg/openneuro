import { decodeJWT } from "../libs/authentication/jwt"
import { checkDatasetWrite } from "../graphql/permissions"
// TODO - global.crypto.randomUUID exists on all platforms
import { randomUUID } from "node:crypto"

export function acceptUpload(datasetId: string, uploaderId: string) {
  const uuid = randomUUID()
  return {
    "ChangeFileInfo": {
      ID: `${datasetId}/${uuid}`,
      MetaData: {
        datasetId,
        uploaderId,
      },
    },
    "RejectUpload": false,
  }
}

export const rejectUpload = {
  "HTTPResponse": {
    StatusCode: 403,
    Body: '{"message":"access denied to dataset"}',
    Header: {
      "Content-Type": "application/json",
    },
  },
  "RejectUpload": true,
}

export const tusdHandler = (req, res, next) => {
  try {
    const token = req.params.token
    const decodedToken = decodeJWT(token)
    const userId = decodedToken?.sub
    const userInfo = {
      id: decodedToken?.sub,
      exp: decodedToken?.exp,
      scopes: decodedToken?.scopes,
      admin: decodedToken?.admin,
    }
    if (req.body.Type === "pre-create") {
      const datasetId = req.body.Event.MetaData.datasetId
      if (checkDatasetWrite(datasetId, userId, userInfo)) {
        res.json(acceptUpload(datasetId, userId))
      } else {
        res.json(rejectUpload)
      }
    }
  } catch (err) {
    res.status(401)
    next(err)
  }
}
