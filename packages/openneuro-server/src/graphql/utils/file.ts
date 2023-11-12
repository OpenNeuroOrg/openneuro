import BadAnnexObject from "../../models/badAnnexObject"

export const filterRemovedAnnexObjects =
  (datasetId, userInfo) => async (files) => {
    const removedAnnexObjectKeys = (
      await BadAnnexObject.find({ datasetId }).exec()
    ).map(({ annexKey }) => annexKey)
    // keep files that haven't had their annex objects removed
    return userInfo?.admin
      ? files
      : files.filter(({ key }) => !removedAnnexObjectKeys.includes(key))
  }
