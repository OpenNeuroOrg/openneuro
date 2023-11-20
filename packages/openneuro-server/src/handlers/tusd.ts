import { checkDatasetWrite } from "../graphql/permissions"
// TODO - global.crypto.randomUUID exists on all platforms
import { randomUUID } from "node:crypto"

export function acceptUpload(datasetId: string, uploaderId: string) {
  const uuid = randomUUID()
  return {
    "ChangeFileInfo": {
      ID: `${datasetId}-${uuid}`,
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
    const userId = req.user.id
    const userInfo = {
      id: userId,
      admin: req.user.admin,
    }
    if (req.body.Type === "pre-create") {
      try {
        const datasetId = req.body.Event.Upload.MetaData.datasetId
        if (checkDatasetWrite(datasetId, userId, userInfo)) {
          res.json(acceptUpload(datasetId, userId))
        } else {
          res.json(rejectUpload)
        }
      } catch (_err) {
        res.status(400)
        res.send("`datasetId` MetaData parameter is required to upload")
      }
    }
  } catch (err) {
    res.status(401)
    next(err)
  }
}
