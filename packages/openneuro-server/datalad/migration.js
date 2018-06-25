/* eslint-disable */
import fs from 'fs'
import path from 'path'
import request from 'superagent'
import mongo from '../libs/mongo.js'
import { connect as redis_connect } from '../libs/redis.js'
import scitran from '../libs/scitran.js'
import * as dataset from '../datalad/dataset.js'
import * as snapshots from '../datalad/snapshots.js'
import bids from '../libs/bidsId.js'
import config from '../config.js'
import files from '../libs/files.js'

const DRY_RUN = false

// Make the migration easier to debug when things go badly
process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error)
})

const migrateAll = () => {
  const c = mongo.collections
  c.scitran.projects
    .find({})
    .toArray()
    .then(async projects => {
      for (const dataset of projects) {
        // Migrate each dataset in order
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
        // This will throw an exception for a dataset that already exists
        if (!DRY_RUN) {
          const url = `${config.datalad.uri}/datasets/${datasetId}`
          await request
            .post(url)
            .set('Accept', 'application/json')
            .set('From', '"OpenNeuro Importer" <no-reply@openneuro.org>')
          await dataset.createDatasetModel(datasetId, label, uploader)
        }
        for (const snapshot of snapshots.body) {
          const snapshotId = bids.decodeId(snapshot._id)
          console.log(`Migrating snapshot "${snapshotId}"`)
          await migrateSnapshot(datasetId, snapshotId)
        }
      } catch (e) {
        console.log(e)
        console.log(`"${datasetId}" has been imported, skipping`)
        resolve()
      }
    })
  })
}

const migrateSnapshot = (datasetId, snapshotId) => {
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

const deleteFolderRecursive = path => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index) {
      if (file === '.git' || file === '.datalad' || file === '.gitattributes') {
        // Skips this
      } else {
        const curPath = path + '/' + file
        if (fs.lstatSync(curPath).isDirectory()) {
          // recurse
          deleteFolderRecursive(curPath)
        } else {
          // delete file
          fs.unlinkSync(curPath)
        }
      }
    })
    fs.rmdirSync(path)
  }
}

const uploadSnapshotContent = async (datasetId, snapshotId, snapshotDir) => {
  deleteFolderRecursive(`/data/datalad/${datasetId}`)
  files.getFiles(snapshotDir, async snapshotFiles => {
    for (const filePath of snapshotFiles) {
      const relativePath = path.relative(snapshotDir, filePath)
      const file = {
        filename: relativePath,
        stream: fs.createReadStream(filePath),
        mimetype: 'application/octet-stream',
      }
      await dataset.addFile(
        datasetId,
        path.dirname(relativePath) === '.' ? '' : path.dirname(relativePath),
        Promise.resolve(file),
      )
      process.stdout.write('.')
    }
  })
  console.log('\n')
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
  redis_connect(config.redis).then(() => {
    migrateAll()
  })
})
