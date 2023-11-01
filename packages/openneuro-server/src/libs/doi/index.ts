import request from 'superagent'
import config from '../../config'

export const template = ({
  doi,
  creators,
  title,
  year,
  resourceType,
}) => `<?xml version="1.0" encoding="UTF-8"?>
<resource xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://datacite.org/schema/kernel-4" xsi:schemaLocation="http://datacite.org/schema/kernel-4 http://schema.datacite.org/meta/kernel-4/metadata.xsd">
  <identifier identifierType="DOI">${doi}</identifier>
  <creators>
  ${creators
    .map(creator => `<creator><creatorName>${creator}</creatorName></creator>`)
    .join('')}
  </creators>
  <titles>
    <title xml:lang="en-us">${title}</title>
  </titles>
  <publisher>Openneuro</publisher>
  <publicationYear>${year}</publicationYear>
  <resourceType resourceTypeGeneral="Dataset">${resourceType}</resourceType>
</resource>`

/**
 * @param {Object} doiConfig
 * @param {string} doiConfig.username DOI service username
 * @param {string} doiConfig.password DOI service password
 */
export const formatBasicAuth = doiConfig =>
  'Basic ' +
  Buffer.from(doiConfig.username + ':' + doiConfig.password).toString('base64')

export default {
  auth: formatBasicAuth(config.doi),
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

  registerMetadata(context) {
    const xml = template(context)
    return request
      .post(config.doi.url + 'metadata/')
      .set('Authorization', this.auth)
      .set('Content-Type', 'application/xml;charset=UTF-8')
      .send(xml)
  },

  registerSnapshotDoi(datasetId, snapshotId, oldDesc) {
    const baseDoi = this.createDOI(datasetId, snapshotId)
    const url = `https://openneuro.org/datasets/${datasetId}/versions/${snapshotId}`
    const context = {
      doi: baseDoi,
      creators: oldDesc.Authors.filter(x => x),
      title: oldDesc.Name,
      year: new Date().getFullYear(),
      resourceType: 'fMRI',
    }
    return this.registerMetadata(context)
      .then(() => {
        return this.mintDOI(baseDoi, url)
      })
      .then(() => {
        return baseDoi
      })
  },
}
