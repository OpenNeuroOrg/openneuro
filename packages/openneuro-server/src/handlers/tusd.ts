import { checkDatasetWrite } from "../graphql/permissions"

export function acceptUpload(
  datasetId: string,
  uploaderId: string,
  path: string,
) {
  return {
    "ChangeFileInfo": {
      ID: `${datasetId}:${uploaderId}:${path.replaceAll("/", ":")}`,
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
          const path = req.body.Event.Upload.MetaData.relativePath
          res.json(acceptUpload(datasetId, userId, path))
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
