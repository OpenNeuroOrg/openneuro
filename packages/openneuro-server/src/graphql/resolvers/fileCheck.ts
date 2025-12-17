import config from "../../config"
import { generateDataladCookie } from "../../libs/authentication/jwt"
import { getDatasetWorker } from "../../libs/datalad-service"
import { redlock } from "../../libs/redis"
import FileCheck from "../../models/fileCheck"
import { checkDatasetAdmin, checkDatasetWrite } from "../permissions"

export const updateFileCheck = async (
  obj,
  { datasetId, hexsha, refs, remote, annexFsck },
  { user, userInfo },
) => {
  await checkDatasetAdmin(datasetId, user, userInfo)
  return await FileCheck.findOneAndUpdate(
    { datasetId, hexsha },
    { datasetId, hexsha, remote, refs, annexFsck },
    { upsert: true, new: true },
  )
    .lean()
    .exec()
}

export const fsckUrl = (datasetId) => {
  return `http://${
    getDatasetWorker(
      datasetId,
    )
  }/datasets/${datasetId}/fsck`
}

export const fsckDataset = async (_, { datasetId }, { user, userInfo }) => {
  // Anonymous users can't trigger fsck
  try {
    await checkDatasetWrite(datasetId, user, userInfo)
  } catch {
    return false
  }
  try {
    // Lock for 30 minutes to avoid stacking fsck requests
    await redlock.lock(`openneuro:recheck-lock:${datasetId}`, 1800000)
    const response = await fetch(fsckUrl(datasetId), {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        cookie: generateDataladCookie(config)(userInfo),
      },
    })
    if (response.status === 200) {
      return true
    } else {
      return false
    }
  } catch (err) {
    // Backend unavailable or lock failed
    if (err) {
      return false
    }
  }
}
