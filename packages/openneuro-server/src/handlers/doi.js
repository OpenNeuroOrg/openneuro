import config from '../config'
import doi from '../libs/doi'
import Doi from '../models/doi'
import Snapshot from '../models/snapshot'

export async function createSnapshotDoi(req, res) {
  let doiRes = null
  if (!config.doi.username || !config.doi.password) {
    return res.send({ doiRes: null })
  }
  const datasetId = req.params.datasetId
  const snapshotId = req.params.snapshotId
  const oldDesc = req.body
  const doiExists = await Doi.findOne({
    datasetId: datasetId,
    snapshotId: snapshotId,
  })
  if (doiExists) {
    doiRes = doiExists.doi
    return res.send({ doi: doiRes })
  } else {
    const snapExists = Snapshot.findOne({
      datasetId: datasetId,
      tag: snapshotId,
    }).exec()
    if (!snapExists) {
      return
    }
    await doi
      .registerSnapshotDoi(datasetId, snapshotId, oldDesc)
      .then(doiRes => {
        if (doiRes) {
          Doi.updateOne(
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
  const doi = await Doi.findOne(
    {
      datasetId: datasetId,
      snapshotId: snapshotId,
    },
    'doi',
  ).exec()
  return res.send(doi)
}
