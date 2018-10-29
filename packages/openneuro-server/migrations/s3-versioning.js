/* eslint-disable no-console */
import config from '../config.js'
import mongo from '../libs/mongo.js'
import mongoose from 'mongoose'
import fs from 'fs'
import moment from 'moment'

// Setup Mongoose
mongoose.connect(`${config.mongo.url}crn`)

const db = mongo.collections.crn

const parseVersionId = url => {
  const hasVersion = url.indexOf('versionId') > -1
  const split = url.split('versionId=')
  const versionId = hasVersion ? split[1] : null
  return versionId
}

/**
 * Retrieve all datasets, and generate .rmet files associated with datasets
 */
const upgrade = async () => {
  const jsonOutput = {}
  // connect to database
  await mongo.connect(config.mongo.url)

  // get all dataset ids
  const datasetIds = await db.datasets
    .find({}, { id: 1 })
    .toArray()
    .then(datasets => datasets.map(ds => ds.id))

  for (const datasetId of datasetIds) {
    jsonOutput[datasetId] = {}
    const snapshots = await db.snapshots
      .find({ datasetId: datasetId }, { tag: 1, created: 1 })
      .toArray()
    // console.log('datasetId:', datasetId, 'snapshots:', snapshots)
    for (const snapshot of snapshots) {
      const tag = snapshot.tag
      const created = snapshot.created
      jsonOutput[datasetId][tag] = { files: [] }
      jsonOutput[datasetId][tag]['created'] = moment(created).unix()

      //   console.log('snapshot tag:', tag)
      const files = await db.files
        .findOne({ datasetId, tag })
        .then(filesObj => (filesObj ? filesObj.files : []))
      for (const file of files) {
        const filename = file.filename
        const filesUrl = file.urls && file.urls.length ? file.urls[0] : ''
        const versionId = parseVersionId(filesUrl)
        let bucket = ''
        if (filesUrl.indexOf('private') > -1) {
          bucket = 's3-PRIVATE'
        } else if (filesUrl.indexOf('public') > -1) {
          bucket = 's3-PUBLIC'
        }
        // console.log('filename:', filename, ' - versionId:', versionId)
        jsonOutput[datasetId][tag].files.push({ filename, versionId, bucket })
      }
    }
  }
  fs.writeFile(
    '/srv/persistent/fileVersions.json',
    new Uint8Array(Buffer.from(JSON.stringify(jsonOutput))),
    err => {
      if (err) console.log('err:', err)
      console.log('file written!')
      process.exit()
    },
  )
}

upgrade()
