import FileCheck from "../../models/fileCheck"
import { checkDatasetAdmin } from "../permissions"

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
