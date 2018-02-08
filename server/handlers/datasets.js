// dependencies ------------------------------------------------------------

import config from '../config'
import scitran from '../libs/scitran'
import request from '../libs/request'
import notifications from '../libs/notifications'
import url from 'url'
import crypto from 'crypto'
import counter from '../libs/counter'
import bidsId from '../libs/bidsId'

// handlers ----------------------------------------------------------------

/**
 * Datasets
 *
 * Handlers for dataset interactions. Only used for those interactions that require
 * manipulations beyond what scitran offers directly.
 */
export default {
  create(req, res) {
    
    counter.getNext('datasets', datasetNumber => {
      let offset = 1000
      datasetNumber += offset
      datasetNumber = 'ds' + ('000000' + datasetNumber).substr(-6, 6)
      req.body._id = datasetNumber
      delete req.headers['content-length']
      delete req.headers['accept-encoding']
      request.post(
        config.scitran.url + 'projects',
        {
          body: req.body,
          headers: req.headers,
          query: req.query,
          droneRequest: false,
        },
        (err, resp) => {
          res.send(resp.body)
        },
      )
    })
  },

  snapshot(req, res) {
    let datasetId = req.params.datasetId
    counter.getNext(datasetId, versionCount => {
      let versionNumber = ('00000' + versionCount).substr(-5, 5)
      let datasetNumber = bidsId.decodeId(datasetId).slice(2)
      let versionId = datasetNumber + '-' + versionNumber

      delete req.headers['accept-encoding']
      request.post(
        config.scitran.url +
          'snapshots/projects/' +
          bidsId.hexFromASCII(versionId),
        {
          headers: req.headers,
          query: { project: datasetId },
        },
        (err, resp) => {
          res.send(resp.body)
        },
      )
    })
  },

  /**
     * Share
     */
  share(req, res) {
    // proxy add permission request to scitran to avoid extra permissions checks
    delete req.headers['accept-encoding']
    request.post(
      config.scitran.url + 'projects/' + req.params.datasetId + '/permissions',
      {
        body: req.body,
        headers: req.headers,
        query: req.query,
        droneRequest: false,
      },
      (err, resp) => {
        if (resp.statusCode == 200) {
          // send notification
          scitran.getUser(req.body._id, (err1, resp1) => {
            scitran.getProject(req.params.datasetId, (err2, resp2) => {
              let data = {
                firstName: resp1.body.firstname,
                lastName: resp1.body.lastname,
                email: req.body._id,
                datasetId: req.params.datasetId,
                datasetName: resp2.body.label,
                siteUrl:
                  url.parse(config.url).protocol +
                  '//' +
                  url.parse(config.url).hostname,
              }
              let id = crypto
                .createHash('md5')
                .update(data.email + data.datasetId + data.siteUrl)
                .digest('hex')
              notifications.add({
                _id: id,
                type: 'email',
                email: {
                  to: data.email,
                  subject:
                    'Dataset ' + data.datasetName + ' was shared with you.',
                  template: 'dataset-shared',
                  data: data,
                },
              })
            })
          })
        }
        res.send(resp)
      },
    )
  },
}
