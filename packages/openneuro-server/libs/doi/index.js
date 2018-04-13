import request from 'superagent'
import config from '../../config'
import templates from './templates'
import bidsId from '../bidsId'

export default {
  auth:
    'Basic ' +
    new Buffer(config.doi.username + ':' + config.doi.password).toString(
      'base64',
    ),
  createDOI(accNumber, snapshotId) {
    let doi = config.doi.prefix + '/openneuro.' + accNumber
    if (snapshotId) {
      doi = doi + '.v' + snapshotId
    }
    return doi
  },

  async mintDOI(doi, url) {
    return await request
      .put(config.doi.url + 'doi/' + doi)
      .set('Authorization', this.auth)
      .set('Content-Type', 'text/plain;charset=UTF-8')
      .send('doi=' + doi + '\nurl=' + url)
  },

  async registerMetadata(context) {
    let xml = templates['metadata'](context)
    return request
      .post(config.doi.url + 'metadata/')
      .set('Authorization', this.auth)
      .set('Content-Type', 'application/xml;charset=UTF-8')
      .send(xml)
  },

  async registerSnapshotDoi(datasetId) {
    let baseDoi, url, context
    return request
      .get(config.scitran.url + 'snapshots/projects/' + datasetId)
      .then(res => {
        let originalId = bidsId.decodeId(res.body.original)
        let snapId = res.body.snapshot_version
        baseDoi = this.createDOI(originalId, snapId)
        url =
          'https://openneuro.org/datasets/' + originalId + '/versions/' + snapId
        context = {
          doi: baseDoi,
          creators: res.body.metadata.authors.map(x => x.name),
          title: res.body.label,
          year: new Date().getFullYear(),
          resourceType: 'fMRI',
        }
        return this.registerMetadata(context)
      })
      .then(async () => {
        return this.mintDOI(baseDoi, url)
      })
      .then(async () => {
        return baseDoi
      })
      .catch(() => {
        return null
      })
  },
}
