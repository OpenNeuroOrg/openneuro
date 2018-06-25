/* eslint-disable */
import fs from 'fs'
import path from 'path'
import mongo from '../libs/mongo.js'
import scitran from '../libs/scitran.js'
import * as dataset from '../datalad/dataset.js'
import * as snapshots from '../datalad/snapshots.js'
import bids from '../libs/bidsId.js'
import config from '../config.js'
import files from '../libs/files.js'

const DRY_RUN = false

const migrateAll = () => {
  const c = mongo.collections
  c.scitran.projects
    .find({})
    .toArray()
    .then(async projects => {
      for (const dataset of projects) {
        await migrate(
          bids.decodeId(dataset._id),
          dataset.group,
          dataset.label,
          dataset.created,
        )
      }
    })
}

const migrate = (datasetId, uploader, label, created) => {
  return new Promise((resolve, reject) => {
    console.log(
      `Dataset "${datasetId}"/"${label}" uploaded by "${uploader}" on ${created}`,
    )
    scitran.getProjectSnapshots(datasetId, async (err, snapshots) => {
      console.log(`Found ${snapshots.body.length} snapshots.`)
      if (snapshots.body.length === 0) {
        console.log(`WARNING: ${datasetId} has no snapshots`)
      }
      try {
        if (!DRY_RUN) dataset.createDatasetModel(datasetId, label, uploader)
        for (const snapshot of snapshots.body) {
          const snapshotId = bids.decodeId(snapshot._id)
          console.log(`Migrating snapshot "${snapshotId}"`)
          await migrateSnapshot(datasetId, snapshotId)
        }
      } catch {
        console.log(`"${datasetId}" has been imported, skipping`)
      }
    })
  })
}

const migrateSnapshot = async (datasetId, snapshotId) => {
  console.log(`Snapshot migration of "${datasetId}-${snapshotId}"`)
  if (!DRY_RUN) {
    return new Promise((resolve, reject) => {
      scitran.downloadSymlinkDataset(
        bids.encodeId(snapshotId),
        (err, hash) => {
          const snapshotDir = config.location + '/persistent/datasets/' + hash
          uploadSnapshotContent(datasetId, snapshotId, snapshotDir).then(() =>
            resolve(),
          )
        },
        { snapshot: true },
      )
    })
  }
}

const uploadSnapshotContent = async (datasetId, snapshotId, snapshotDir) => {
  files.getFiles(snapshotDir, async snapshotFiles => {
    for (const filePath of snapshotFiles) {
      const file = fs.createReadStream(filePath)
      const relativePath = path.relative(snapshotDir, filePath)
      await dataset.updateFile(datasetId, relativePath, file)
    }
  })
  console.log(`Files for "${datasetId}-${snapshotId}" transferred.`)
  await dataset.commitFiles(
    datasetId,
    'DataLad Importer',
    'no-reply@openneuro.org',
  )
  await snapshots.createSnapshot(datasetId, snapshotId)
  console.log(`Snapshot "${snapshotId}" created.`)
}

mongo.connect(config.mongo.url).then(() => {
  migrateAll()
})
