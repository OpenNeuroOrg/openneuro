import config from '../config'
import doi from '../libs/doi'
import mongo from '../libs/mongo'

let c = mongo.collections

export default {
  async createSnapshotDoi(req, res) {
    if (!config.doi.username || !config.doi.password) {
      return res.send({ doi: null })
    }
    const datasetId = req.params.datasetId
    let exists = await c.crn.dois.findOne({ datasetId: datasetId })
    if (exists) {
      let doiRes = exists.doi
    } else {
      let doiRes = await doi.registerSnapshotDoi(datasetId)
      if (doiRes) {
        c.crn.dois.update(
          { datasetId: datasetId },
          { $set: { doi: doiRes } },
          { upsert: true },
        )
      }
    }
    return res.send({ doi: doiRes })
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
