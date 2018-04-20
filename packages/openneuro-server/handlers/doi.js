import config from '../config'
import doi from '../libs/doi'
import mongo from '../libs/mongo'

let c = mongo.collections

export default {
  async createSnapshotDoi(req, res) {
    let doiRes = null
    if (!config.doi.username || !config.doi.password) {
      return res.send({ doiRes: null })
    }
    const datasetId = req.params.datasetId
    let exists = await c.crn.dois.findOne({ datasetId: datasetId })
    if (exists) {
      doiRes = exists.doi
      return res.send({ doi: doiRes })
    } else {
      await doi.registerSnapshotDoi(datasetId).then(doiRes => {
        if (doiRes) {
          c.crn.dois.update(
            { datasetId: datasetId },
            { $set: { doi: doiRes } },
            { upsert: true },
          )
        }
        return res.send({ doi: doiRes })
      })
    }
  },
  // Have seperate function to get Doi that does not require any authorization
  async getDoi(req, res) {
    const datasetId = req.params.datasetId
    let doi = await c.crn.dois.findOne(
      { datasetId: datasetId },
      { doi: 1, _id: 0 },
    )
    return res.send(doi)
  },
}
