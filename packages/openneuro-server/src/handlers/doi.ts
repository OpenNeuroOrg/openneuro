import config from "../config"
import { createDraftDoi } from "../libs/doi"
import { assembleMetadata } from "../libs/doi/metadata"
import Doi from "../models/doi"
import Snapshot from "../models/snapshot"

export async function createSnapshotDoi(req, res) {
  if (!config.doi.username || !config.doi.password) {
    return res.send({ doi: null })
  }
  const datasetId = req.params.datasetId
  const snapshotId = req.params.snapshotId

  // Return existing DOI if already registered
  const doiExists = await Doi.findOne({ datasetId, snapshotId })
  if (doiExists) {
    return res.send({ doi: doiExists.doi })
  }

  const snapExists = await Snapshot.findOne({
    datasetId,
    tag: snapshotId,
  }).exec()
  if (!snapExists) {
    return res.status(404).send({ error: "Snapshot not found" })
  }

  try {
    const attributes = await assembleMetadata(datasetId, snapshotId)
    const doi = await createDraftDoi(attributes)

    await Doi.updateOne(
      { datasetId, snapshotId },
      { $set: { doi, state: "draft" } },
      { upsert: true },
    )

    return res.send({ doi })
  } catch (err) {
    return res.status(500).send({ error: err.message })
  }
}

// Have separate function to get Doi that does not require any authorization
export async function getDoi(req, res) {
  const datasetId = req.params.datasetId
  const snapshotId = req.params.snapshotId
  const doi = await Doi.findOne(
    { datasetId, snapshotId },
    "doi state",
  ).exec()
  return res.send(doi)
}
