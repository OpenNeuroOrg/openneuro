/* Script to update accession numbers in both scitran and crn databases.
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
const util = require('util')

let c = mongo.collections

async function updateAccessionNumber(oldId, newId) {
  let item = await c.scitran.projects.findOne({ _id: ObjectID(oldId) }, {})
  let newIdItem = await c.scitran.projects.findOne({_id: ObjectID(newId)}, {})
  
  if (newIdItem) {
    return new Promise((resolve) => {
      // eslint-disable-next-line no-console
      console.log('New Id already in db: ' + bidsId.decodeId(newId))
      resolve('newId found')
    })
  }

  let retPromises = []
  retPromises.push(
    updateId(
      c.scitran.projects,
      item,
      { _id: ObjectID(newId) },
      ObjectID(oldId),
    ),
    updateSnapshotsId(oldId, newId),
    updateJobs(oldId, newId),
    updateId(
      c.crn.counters,
      await c.crn.counters.findOne({ _id: oldId }, {}),
      { _id: newId },
      oldId,
    ),
    updateAnalytics(oldId, newId),
    c.crn.comments.updateMany(
      { datasetId: oldId },
      { $set: { datasetId: newId } },
    ),
    c.crn.stars.updateMany(
      { datasetId: oldId },
      { $set: { datasetId: newId } },
    ),
    c.crn.subscriptions.updateMany(
      { datasetId: oldId },
      { $set: { datasetId: newId } },
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
    retPromises.push(
      updatePromise,
      c.crn.notifications.updateMany(
        {
          'email.data.datasetId': bidsId.decodeId(oldId),
          'email.data.snapshotId': bidsId.decodeId(snapId)
        },
        {
          $set: {
            'email.data.datasetId': bidsId.decodeId(newId),
            'email.data.snapshotId': bidsId.decodeId(snapId)
          }
        }
      )
    )
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
    let jobPromise = c.crn.jobs.updateOne(
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

async function updateAnalytics(oldId, newId) {
  let _oldId = oldId.slice(12)
  let oldIdRegex = new RegExp(util.format('^%s.*', _oldId))
  const distinct = await c.scitran.analytics.distinct('container_id', {
    container_id: oldIdRegex,
  })

  let retPromises = []

  distinct.forEach(item => {
    let snapId = item
    let verId = bidsId.decodeId(snapId)
    let newSnapId = bidsId.encodeId(
      bidsId.decodeId(newId).slice(2) + '-' + verId,
    )
    retPromises.push(
      c.scitran.analytics.updateMany(
        { container_id: snapId },
        { $set: { container_id: newSnapId } },
      ),
    )
  })
  return Promise.all(retPromises)
}

async function updateId(collection, item, updates, delId) {
  if (item === null) {
    return new Promise(resolve => {
      resolve('update id item null')
    })
  }
  Object.keys(updates).map(key => (item[key] = updates[key]))
  return await collection
    .insert(item, {})
    .then(async () => {
      await collection.deleteOne({ _id: delId }, {})
    })
    .catch(err => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('update id error')
        // eslint-disable-next-line no-console
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
