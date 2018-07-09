// dependencies ------------------------------------------------------------

import config from '../config'
import scitran from '../libs/scitran'
import request from '../libs/request'
import notifications from '../libs/notifications'
import url from 'url'
import crypto from 'crypto'
import { getAccessionNumber } from '../libs/dataset'
import counter from '../libs/counter'
import bidsId from '../libs/bidsId'
import mongo from '../libs/mongo'

let c = mongo.collections
// handlers ----------------------------------------------------------------

/**
 * Datasets
 *
 * Handlers for dataset interactions. Only used for those interactions that require
 * manipulations beyond what scitran offers directly.
 */
export default {
  async create(req, res) {
    req.body._id = await getAccessionNumber()
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
          notifications.snapshotCreated(datasetId, versionNumber)
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
                name: resp1.body.name,
                email: resp1.body.email,
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

  analytics(req, res, next) {
    let datasetId = req.params.datasetId
    if (datasetId) {
      // dataset page view
      let datasetQuery = { container_id: datasetId }
      c.scitran.analytics
        .aggregate([
          {
            $match: datasetQuery,
          },
          {
            $group: {
              _id: '$container_id',
              views: {
                $sum: {
                  $cond: [{ $eq: ['$analytics_type', 'view'] }, 1, 0],
                },
              },
              downloads: {
                $sum: {
                  $cond: [{ $eq: ['$analytics_type', 'download'] }, 1, 0],
                },
              },
            },
          },
        ])
        .toArray((err, analytics) => {
          if (err) return next(err)

          res.send(analytics)
        })
    } else {
      // dashboard page view
      // get all the dataset analytics:
      c.scitran.analytics
        .aggregate([
          {
            $group: {
              _id: '$container_id',
              views: {
                $sum: {
                  $cond: [{ $eq: ['$analytics_type', 'view'] }, 1, 0],
                },
              },
              downloads: {
                $sum: {
                  $cond: [{ $eq: ['$analytics_type', 'download'] }, 1, 0],
                },
              },
            },
          },
        ])
        .toArray((err, results) => {
          if (err) return next(err)

          if (req.isSuperUser) {
            // if the user is admin, send all results
            res.send(results)
          } else {
            if (!req.user) {
              // if there is no user, get a list of public datasets
              // and send back the results for those
              c.scitran.project_snapshots
                .find({ public: true })
                .toArray((err, snapshots) => {
                  if (err) return next(err)

                  let projectIds = snapshots.map(snapshot => {
                    return snapshot._id.toString()
                  })
                  let analytics = results.filter(result => {
                    return projectIds.indexOf(result._id) > -1
                  })
                  res.send(analytics)
                })
            } else {
              // if there is a user, find all snapshots and projects to which the user
              // has access and send back results for those
              c.scitran.project_snapshots
                .find({ 'permissions._id': req.user })
                .toArray((err, snapshots) => {
                  if (err) return next(err)

                  const snapshotIds = snapshots.map(snapshot => {
                    return snapshot._id.toString()
                  })

                  c.scitran.projects
                    .find({ 'permissions._id': req.user })
                    .toArray((err, projects) => {
                      if (err) return next(err)

                      const projectIds = projects.map(project => {
                        return project._id.toString()
                      })
                      const datasetIds = projectIds.concat(snapshotIds)
                      const filteredAnalytics = results.filter(result => {
                        return datasetIds.indexOf(result._id) > -1
                      })
                      res.send(filteredAnalytics)
                    })
                })
            }
          }
        })
    }
  },
}
