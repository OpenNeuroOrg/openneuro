/* eslint-disable */
import fs from 'fs'
import path from 'path'
import superagent from 'superagent'
import request from '../libs/request.js'
import mongo from '../libs/mongo.js'
import { connect as redis_connect } from '../libs/redis.js'
import scitran from '../libs/scitran.js'
import * as dataset from '../datalad/dataset.js'
import * as snapshots from '../datalad/snapshots.js'
import bids from '../libs/bidsId.js'
import config from '../config.js'
import files from '../libs/files.js'

// Make the migration easier to debug when things go badly
process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error)
})

// Setup a migration of all SciTran datasets
const migrateAll = () => {
  const c = mongo.collections
  c.scitran.projects
    .find({})
    .toArray()
    .then(projects =>
      projects.filter(project =>
        bids.decodeId(project._id.toString()).startsWith('ds'),
      ),
    )
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

// Promise wrapper for SciTran project snapshots request
const createScitranSnapshot = datasetId => {
  return new Promise((resolve, reject) => {
    request.post(
      config.scitran.url + 'snapshots',
      {
        query: { project: bids.encodeId(datasetId) },
      },
      err => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve()
        }
      },
    )
  })
}

// Migrate a dataset to the new backend
const migrate = (datasetId, uploader, label, created) => {
  return new Promise((resolve, reject) => {
    console.log(
      `Dataset "${datasetId}"/"${label}" uploaded by "${uploader}" on ${created}`,
    )
    scitran.getProjectSnapshots(datasetId, async (err, snapshots) => {
      console.log(`Found ${snapshots.body.length} snapshots.`)
      if (snapshots.body.length === 0) {
        // Create at least one private snapshot if none exist
        console.log(
          `WARNING: ${datasetId} has no snapshots - creating SciTran snapshot`,
        )
        await createScitranSnapshot(datasetId)
        console.log(`${datasetId} snapshot created - rerunning migration`)
        await migrate(datasetId, uploader, label, created)
        resolve()
      } else {
        try {
          // This will throw an exception for a dataset that already exists
          const url = `${config.datalad.uri}/datasets/${datasetId}`
          await superagent
            .post(url)
            .set('Accept', 'application/json')
            .set('From', '"OpenNeuro Importer" <no-reply@openneuro.org>')
          await dataset.createDatasetModel(datasetId, label, uploader, created)
          // If all snapshots are public, the dataset is now public
          if (snapshots.body.filter(snapshot => snapshot.public).length > 0) {
            await dataset.updatePublic(datasetId, true)
          }
          const chronological = snapshots.body.sort(
            (a, b) => new Date(b.created) - new Date(a.created),
          )
          for (const snapshot of chronological) {
            const snapshotId = bids.decodeId(snapshot._id)
            await migrateSnapshot(datasetId, snapshotId)
          }
          resolve()
        } catch (e) {
          console.log(e)
          console.log(`"${datasetId}" has been imported, skipping`)
          resolve()
        }
      }
    })
  })
}

const migrateSnapshot = (datasetId, snapshotId) => {
  console.log(`Snapshot migration of "${datasetId}-${snapshotId}"`)
  return new Promise((resolve, reject) => {
    const scitranSnapshotId =
      snapshotId.length === 5
        ? bids.encodeId(`${datasetId.slice(2)}-${snapshotId}`)
        : snapshotId
    console.log(`Getting files for snapshot: "${scitranSnapshotId}"`)
    scitran.downloadSymlinkDataset(
      bids.encodeId(scitranSnapshotId),
      (err, hash) => {
        if (err) {
          console.log(err)
        }
        const snapshotDir = config.location + '/persistent/datasets/' + hash
        uploadSnapshotContent(datasetId, snapshotId, snapshotDir).then(() =>
          resolve(),
        )
      },
      { snapshot: true },
    )
  })
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

const uploadSnapshotContent = (datasetId, snapshotId, snapshotDir) => {
  return new Promise((resolve, reject) => {
    files.getFiles(snapshotDir, async snapshotFiles => {
      deleteFolderRecursive(`/data/datalad/${datasetId}`)
      for (const filePath of snapshotFiles) {
        const relativePath = path.relative(snapshotDir, filePath)
        const readStream = fs.createReadStream(filePath)
        // Setup a promise that waits for the file
        const readStreamPromise = new Promise(resolve => {
          readStream.on('end', () => {
            resolve()
          })
        })
        // Create a dummy file object to send
        const file = {
          filename: relativePath,
          stream: readStream,
          mimetype: 'application/octet-stream',
        }
        dataset.addFile(
          datasetId,
          path.dirname(relativePath) === '.' ? '' : path.dirname(relativePath),
          Promise.resolve(file),
        )
        console.log(`Writing file "${datasetId}/${snapshotId}/${relativePath}"`)
        // Block until this file is done
        await readStreamPromise
      }
      console.log(`Files for "${datasetId}-${snapshotId}" transferred.`)
      await dataset.commitFiles(
        datasetId,
        'DataLad Importer',
        'no-reply@openneuro.org',
      )
      await snapshots.createSnapshot(datasetId, snapshotId)
      console.log(`Snapshot "${snapshotId}" created.`)
      resolve()
    })
  })
}

mongo.connect(config.mongo.url).then(() => {
  redis_connect(config.redis).then(() => {
    migrateAll()
  })
})
