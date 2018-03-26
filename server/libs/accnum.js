import config from '../config'
import bidsId from './bidsId'
import { ObjectID } from 'mongodb'
import mongo from './mongo'

let c = mongo.collections

async function updateAccessionNumber(oldId, newId) {
  let item = await c.scitran.projects.findOne({ _id: ObjectID(oldId) }, {})
  updateId(c.scitran.projects, item, { _id: ObjectID(newId) }, ObjectID(oldId))
  await updateSnapshotsId(oldId, newId)
  await updateJobs(oldId, newId)
  let cntr_item = await c.crn.counters.findOne({ _id: ObjectID(oldId) }, {})
  return await updateId(
    c.crn.counters,
    cntr_item,
    { _id: ObjectID(newId) },
    ObjectID(oldId),
  )
}

async function updateSnapshotsId(oldId, newId) {
  const cursor = c.scitran.project_snapshots.find(
    { original: ObjectID(oldId) },
    {},
  )
  for (
    let item = await cursor.next();
    item != null;
    item = await cursor.next()
  ) {
    let snapId = item['_id']
    let verId = bidsId.decodeId(snapId)
    let newSnapId = bidsId.decodeId(newId).slice(2) + '-' + verId
    return await updateId(
      c.scitran.project_snapshots,
      item,
      {
        _id: ObjectID(bidsId.encodeId(newSnapId)),
        original: ObjectID(newId),
      },
      snapId,
    )
  }
}

async function updateJobs(oldId, newId) {
  const cursor = c.crn.jobs.find({ datasetId: oldId }, {})
  for (
    let item = await cursor.next();
    item != null;
    item = await cursor.next()
  ) {
    let jobId = item['_id']
    let snapId = item['snapshotId']
    let verId = bidsId.decodeId(snapId)
    let newSnapId = bidsId.decodeId(newId).slice(2) + '-' + verId
    return await c.crn.jobs.update(
      { _id: ObjectID(jobId) },
      {
        $set: {
          snapshotId: bidsId.encodeId(newSnapId),
          datasetId: newId,
        },
      },
    )
  }
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

let accessionNumbers = [['ds001001', 'ds001002']]

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
