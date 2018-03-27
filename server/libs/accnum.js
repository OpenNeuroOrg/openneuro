/* Scritp to update accession numbers in both scitran and crn databases.
 * Expects first argument passed to the script to be a json file with key 
 * 'accessionNumbers' and value an array of arrays of the form:
 * [["ds000001", "ds000002"],...] where the first element of the inner array 
 * is an existing accession number, and the second element is the accession
 * number it should be updated to.
 */

import config from '../config'
import bidsId from './bidsId'
import { ObjectID } from 'mongodb'
import mongo from './mongo'
const fs = require('fs')

let c = mongo.collections

async function updateAccessionNumber(oldId, newId) {
  let item = await c.scitran.projects.findOne({ _id: ObjectID(oldId) }, {})
  updateId(c.scitran.projects, item, { _id: ObjectID(newId) }, ObjectID(oldId))
  let retPromises = []
  retPromises.push(
    updateSnapshotsId(oldId, newId),
    updateJobs(oldId, newId),
    updateId(
      c.crn.counters,
      await c.crn.counters.findOne({ _id: ObjectID(oldId) }, {}),
      { _id: ObjectID(newId) },
      ObjectID(oldId),
    ),
  )
  return Promise.all(retPromises)
}

async function updateSnapshotsId(oldId, newId) {
  const cursor = c.scitran.project_snapshots.find(
    { original: ObjectID(oldId) },
    {},
  )
  let retPromises = []
  for (
    let item = await cursor.next();
    item != null;
    item = await cursor.next()
  ) {
    let snapId = item['_id']
    let verId = bidsId.decodeId(snapId)
    let newSnapId = bidsId.decodeId(newId).slice(2) + '-' + verId
    let updatePromise = updateId(
      c.scitran.project_snapshots,
      item,
      {
        _id: ObjectID(bidsId.encodeId(newSnapId)),
        original: ObjectID(newId),
      },
      snapId,
    )
    retPromises.push(updatePromise)
  }
  return Promise.all(retPromises)
}

async function updateJobs(oldId, newId) {
  const cursor = c.crn.jobs.find({ datasetId: oldId }, {})
  let retPromises = []
  for (
    let item = await cursor.next();
    item != null;
    item = await cursor.next()
  ) {
    let jobId = item['_id']
    let snapId = item['snapshotId']
    let verId = bidsId.decodeId(snapId)
    let newSnapId = bidsId.decodeId(newId).slice(2) + '-' + verId
    let jobPromise = c.crn.jobs.update(
      { _id: ObjectID(jobId) },
      {
        $set: {
          snapshotId: bidsId.encodeId(newSnapId),
          datasetId: newId,
        },
      },
    )
    retPromises.push(jobPromise)
  }
  return Promise.all(retPromises)
}

async function updateId(collection, item, updates, delId) {
  if (item === null) {
    return new Promise((resolve, reject) => {
      resolve('update id item null')
    })
  }
  Object.keys(updates).map(key => (item[key] = updates[key]))
  collection
    .insert(item, {})
    .then(async () => {
      return await collection.deleteOne({ _id: delId }, {})
    })
    .catch(err => {
      if (err) {
        console.log('update id error')
        console.log(err)
      }
    })
}

const args = process.argv

let toUpdate = JSON.parse(fs.readFileSync(args[2]))

let accessionNumbers = toUpdate.accessionNumbers

mongo.connect(config.mongo.url, () => {
  Promise.all(
    accessionNumbers.map(async elem => {
      return updateAccessionNumber(
        bidsId.encodeId(elem[0]),
        bidsId.encodeId(elem[1]),
      )
    }),
  ).then(() => {
    mongo.shutdown()
  })
})
