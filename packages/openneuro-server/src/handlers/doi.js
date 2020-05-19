import config from '../config'
import doi from '../libs/doi'
import mongo from '../libs/mongo'

const c = mongo.collections

export async function createSnapshotDoi(req, res) {
  let doiRes = null
  if (!config.doi.username || !config.doi.password) {
    return res.send({ doiRes: null })
  }
  const datasetId = req.params.datasetId
  const snapshotId = req.params.snapshotId
  const oldDesc = req.body
  const doiExists = await c.crn.dois.findOne({
    datasetId: datasetId,
    snapshotId: snapshotId,
  })
  if (doiExists) {
    doiRes = doiExists.doi
    return res.send({ doi: doiRes })
  } else {
    const snapExists = c.crn.snapshots.findOne({
      datasetId: datasetId,
      tag: snapshotId,
    })
    if (!snapExists) {
      return
    }
    await doi
      .registerSnapshotDoi(datasetId, snapshotId, oldDesc)
      .then(doiRes => {
        if (doiRes) {
          c.crn.dois.update(
            { datasetId: datasetId, snapshotId: snapshotId },
            { $set: { doi: doiRes } },
            { upsert: true },
          )
          return res.send({ doi: doiRes })
        }
        return res.send({ doiRes: null })
      })
  }
}

// Have seperate function to get Doi that does not require any authorization
export async function getDoi(req, res) {
  const datasetId = req.params.datasetId
  const snapshotId = req.params.snapshotId
  const doi = await c.crn.dois.findOne(
    { datasetId: datasetId },
    { snapshotId: snapshotId },
    { doi: 1, _id: 0 },
  )
  return res.send(doi)
}
