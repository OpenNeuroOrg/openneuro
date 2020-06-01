/*eslint no-console: ["error", { allow: ["log"] }] */

import config from '../config'
import cron from 'cron'
import mongo from './mongo'
import email from './email'
import request from 'superagent'
import User from '../models/user'
import moment from 'moment'
import url from 'url'
import bidsId from './bidsId'
import { convertFromRaw, EditorState } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import { getDatasetWorker } from '../libs/datalad-service'

const c = mongo.collections

function noop() {
  // No callback helper
}

// public api ---------------------------------------------

const notifications = {
  cron: null,

  /**
   * Add
   *
   * Takes a notification object and
   * adds it to the database to be processed by
   * the cron.
   */
  add(notification, callback) {
    c.crn.notifications.updateOne(
      { _id: notification._id },
      notification,
      { upsert: true },
      callback,
    )
  },

  /**
   * Send
   */
  send(notification, callback) {
    if (notification.type === 'email') {
      email.send(notification.email, callback)
    }
  },

  /**
   * Job Complete
   *
   * Sends an email notification to the user
   * with the status of their job.
   */
  jobComplete(job) {
    User.findOne({ id: job.userId })
      .exec()
      .then(user => {
        notifications.add(
          {
            _id: job.snapshotId + '_' + job.appId + '_' + job.analysis.created,
            type: 'email',
            email: {
              to: user.email,
              subject:
                'Analysis - ' +
                job.appLabel +
                ' on ' +
                job.datasetLabel +
                ' - ' +
                job.analysis.status,
              template: 'job-complete',
              data: {
                name: user.name,
                appName: job.appLabel,
                appLabel: job.appLabel,
                appVersion: job.appVersion,
                jobId: job.analysis.analysisId,
                startDate: moment(job.analysis.created).format('MMMM Do'),
                datasetName: job.datasetLabel,
                status: job.analysis.status,
                siteUrl:
                  url.parse(config.url).protocol +
                  '//' +
                  url.parse(config.url).hostname,
                datasetId: bidsId.decodeId(job.datasetId),
                snapshotId: bidsId.decodeId(job.snapshotId),
                unsubscribeLink: '',
              },
            },
          },
          noop,
        )
      })
  },

  /**
   * Snapshot Created
   *
   * Sends an email notification to
   * all users following a dataset, informing
   * them that a new snapshot has been created.
   * Includes changelog if available.
   */
  async snapshotCreated(datasetId, body, uploader) {
    const tag = body.tag
    // if we still have a promise for the body files, await it
    const files = await body.files
    const uploaderId = uploader ? uploader.id : null
    const datasetDescription = files.find(
      file => file.filename == 'dataset_description.json',
    )
    const datasetDescriptionId = datasetDescription
      ? datasetDescription.id
      : null
    const URI = getDatasetWorker(datasetId)
    const datasetDescriptionUrl = `${URI}/datasets/${datasetId}/objects/${datasetDescriptionId}`

    const changesFile = files.find(file => file.filename == 'CHANGES')
    const changesId = changesFile ? changesFile.id : null
    const changesUrl = `${URI}/datasets/${datasetId}/objects/${changesId}`

    // get the dataset description
    request.get(datasetDescriptionUrl).then(({ body }) => {
      const description = body
      const datasetLabel = description.Name
        ? description.Name
        : 'Unnamed Dataset'

      // get the snapshot changelog
      request
        .get(changesUrl)
        .responseType('application/octet-stream')
        .then(({ body }) => {
          const changelog = body ? body.toString() : null
          // get all users that are subscribed to the dataset
          c.crn.subscriptions
            .find({ datasetId: datasetId })
            .toArray((err, subscriptions) => {
              // create the email object for each user
              subscriptions.forEach(subscription => {
                User.findOne({ id: subscription.userId })
                  .exec()
                  .then(user => {
                    if (user && user.id !== uploaderId) {
                      const emailContent = {
                        _id:
                          datasetId + '_' + user._id + '_' + 'snapshot_created',
                        type: 'email',
                        email: {
                          to: user.email,
                          subject: 'Snapshot Created',
                          template: 'snapshot-created',
                          data: {
                            name: user.name,
                            datasetLabel: datasetLabel,
                            datasetId: bidsId.decodeId(datasetId),
                            versionNumber: tag,
                            changelog: changelog,
                            siteUrl:
                              url.parse(config.url).protocol +
                              '//' +
                              url.parse(config.url).hostname,
                          },
                        },
                      }
                      // send the email to the notifications database for distribution
                      notifications.add(emailContent, noop)
                    }
                  })
              })
            })
        })
    })
  },

  /**
   * Comment / Reply added
   *
   * Sends an email notification to
   * all users following a dataset, informing
   * them that a new comment has been created.
   */
  commentCreated(comment) {
    const datasetId = comment.datasetId ? comment.datasetId : null
    const datasetLabel = comment.datasetLabel
      ? comment.datasetLabel
      : comment.datasetId
    const userId =
      comment.user && comment.user.email ? comment.user.email : null
    const content = comment.text
    const commentId = comment._id ? comment._id : null
    const isReply = comment.parentId ? comment.parentId : null
    const commentStatus = isReply ? 'reply to a comment' : 'comment'
    const editorState = EditorState.createWithContent(
      convertFromRaw(JSON.parse(content)),
    )
    const contentState = editorState.getCurrentContent()
    const htmlContent = stateToHTML(contentState)

    // get all users that are subscribed to the dataset
    c.crn.subscriptions
      .find({ datasetId: datasetId })
      .toArray((err, subscriptions) => {
        // create the email object for each user, using subscription userid and scitran
        subscriptions.forEach(subscription => {
          User.findOne({ id: subscription.userId })
            .exec()
            .then(user => {
              if (user && user.email !== userId) {
                const emailContent = {
                  _id:
                    datasetId +
                    '_' +
                    subscription._id +
                    '_' +
                    comment._id +
                    '_' +
                    'comment_created',
                  type: 'email',
                  email: {
                    to: user.email,
                    from:
                      'reply-' +
                      encodeURIComponent(comment._id) +
                      '-' +
                      encodeURIComponent(user._id),
                    subject: 'Comment Created',
                    template: 'comment-created',
                    data: {
                      name: user.name,
                      lastName: user.lastname,
                      datasetName: bidsId.decodeId(datasetId),
                      datasetLabel: datasetLabel,
                      commentUserId: userId,
                      commentId: commentId,
                      dateCreated: moment(comment.createDate).format('MMMM Do'),
                      commentContent: htmlContent,
                      commentStatus: commentStatus,
                      siteUrl:
                        url.parse(config.url).protocol +
                        '//' +
                        url.parse(config.url).hostname,
                    },
                  },
                }
                // send each email to the notification database for distribution
                notifications.add(emailContent, noop)
              }
            })
        })
      })
  },

  /**
   * Dataset Deleted
   *
   * Sends an email notification to
   * all users following a dataset, informing
   * them that a the dataset has been deleted.
   */
  datasetDeleted(datasetId) {
    console.log(
      'datasetDeleted notification sent with datasetName:',
      bidsId.decodeId(datasetId),
    )

    // get all users that are subscribed to the dataset
    c.crn.subscriptions
      .find({ datasetId: datasetId })
      .toArray((err, subscriptions) => {
        // create the email object for each user, using subscription userid and scitran
        subscriptions.forEach(subscription => {
          User.findOne({ id: subscription.userId })
            .exec()
            .then(user => {
              if (user) {
                const emailContent = {
                  _id:
                    datasetId +
                    '_' +
                    subscription._id +
                    '_' +
                    'dataset_deleted',
                  type: 'email',
                  email: {
                    to: user.email,
                    subject: 'Dataset Deleted',
                    template: 'dataset-deleted',
                    data: {
                      name: user.name,
                      datasetName: bidsId.decodeId(datasetId),
                      siteUrl:
                        url.parse(config.url).protocol +
                        '//' +
                        url.parse(config.url).hostname,
                    },
                  },
                }
                // send each email to the notification database for distribution
                notifications.add(emailContent, noop)
              }
            })
        })
      })
  },

  /**
   * Owner Unsubscribed
   *
   * Sends an email notification to
   * all users following a dataset, informing
   * them that a the uploader of the dataset is no longer following.
   */
  ownerUnsubscribed(datasetId) {
    console.log(
      'ownerUnsubscribed notification sent with datasetName:',
      bidsId.decodeId(datasetId),
    )

    // get all users that are subscribed to the dataset
    c.crn.subscriptions
      .find({ datasetId: datasetId })
      .toArray((err, subscriptions) => {
        // create the email object for each user, using subscription userid and scitran
        subscriptions.forEach(subscription => {
          User.findOne({ id: subscription.userId })
            .exec()
            .then(user => {
              if (user) {
                const emailContent = {
                  _id:
                    datasetId +
                    '_' +
                    subscription._id +
                    '_' +
                    'owner_unsubscribed',
                  type: 'email',
                  email: {
                    to: user.email,
                    subject: 'Owner Unsubscribed',
                    template: 'owner-unsubscribed',
                    data: {
                      name: user.name,
                      datasetName: bidsId.decodeId(datasetId),
                      siteUrl:
                        url.parse(config.url).protocol +
                        '//' +
                        url.parse(config.url).hostname,
                    },
                  },
                }
                // send each email to the notification database for distribution
                notifications.add(emailContent, noop)
              }
            })
        })
      })
  },

  initCron() {
    // notifications cron -------------------------------------
    notifications.cron = new cron.CronJob(
      '0 */1 * * * *',
      () => {
        c.crn.notifications.find({}).toArray((err, docs) => {
          if (err) {
            console.log(
              'NOTIFICATION ERROR - Could not find notifcations collection',
            )
          } else {
            for (const notification of docs) {
              notifications.send(notification, (err, response) => {
                if (!err) {
                  c.crn.notifications.removeOne(
                    { _id: notification._id },
                    {},
                    noop,
                  )
                  if (response && response.messageId) {
                    c.crn.mailgunIdentifiers.insertOne({
                      messageId: response.messageId,
                    })
                  }
                } else {
                  console.log('NOTIFICATION ERROR ----------')
                  console.log(err)
                }
              })
            }
          }
        })
      },
      null,
      true,
      'America/Los_Angeles',
    )
  },
}

export default notifications
