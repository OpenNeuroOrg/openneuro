/*eslint no-console: ["error", { allow: ["log"] }] */
import toDate from 'date-fns/toDate'
import subHours from 'date-fns/subHours'
import config from '../config'
import { send as emailSend } from './email'
import request from 'superagent'
import Notification from '../models/notification'
import User from '../models/user'
import Subscription from '../models/subscription'
import MailgunIdentifier from '../models/mailgunIdentifier'
import moment from 'moment'
import url from 'url'
import bidsId from './bidsId'
import { convertFromRaw, EditorState } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import { getDatasetWorker } from '../libs/datalad-service'
import { commentCreated } from '../libs/email/templates/comment-created'
import { datasetDeleted } from '../libs/email/templates/dataset-deleted'
import { ownerUnsubscribed } from '../libs/email/templates/owner-unsubscribed'
import { snapshotCreated } from '../libs/email/templates/snapshot-created'
import { snapshotReminder } from '../libs/email/templates/snapshot-reminder'
import { datasetImportEmail } from '../libs/email/templates/dataset-imported'
import { datasetImportFailed } from '../libs/email/templates/dataset-import-failed'

function noop() {
  // No callback helper
}

// public api ---------------------------------------------

const notifications = {
  /**
   * Add
   *
   * Takes a notification object and
   * adds it to the database to be processed by
   * the cron.
   */
  add(notification, callback) {
    Notification.updateOne({ _id: notification._id }, notification, {
      upsert: true,
      new: true,
    }).then(callback)
  },

  /**
   * Send
   */
  send(notification, callback) {
    if (notification.type === 'email') {
      emailSend(notification.email, callback)
    }
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
    const uploaderId = uploader ? uploader.id : null
    const URI = getDatasetWorker(datasetId)
    const datasetDescriptionUrl = `${URI}/datasets/${datasetId}/snapshots/${tag}/files/dataset_description.json`
    const changesUrl = `${URI}/datasets/${datasetId}/snapshots/${tag}/files/CHANGES`

    // get the dataset description
    const descriptionResponse = await request.get(datasetDescriptionUrl)
    const description = descriptionResponse.body
    const datasetLabel = description.Name ? description.Name : 'Unnamed Dataset'

    // get the snapshot changelog
    const changesResponse = await request
      .get(changesUrl)
      .responseType('application/octet-stream')
    const changelog = changesResponse.body
      ? changesResponse.body.toString()
      : null
    // get all users that are subscribed to the dataset
    const subscriptions = await Subscription.find({
      datasetId: datasetId,
    }).exec()
    // create the email object for each user
    subscriptions.forEach(async subscription => {
      const user = await User.findOne({ id: subscription.userId }).exec()
      if (user && user.id !== uploaderId) {
        const emailContent = {
          _id: datasetId + '_' + user._id + '_' + 'snapshot_created',
          type: 'email',
          email: {
            to: user.email,
            subject: 'Snapshot Created',
            html: snapshotCreated({
              name: user.name,
              datasetLabel: datasetLabel,
              datasetId: bidsId.decodeId(datasetId),
              versionNumber: tag,
              changelog: changelog,
              siteUrl:
                url.parse(config.url).protocol +
                '//' +
                url.parse(config.url).hostname,
            }),
          },
        }
        // send the email to the notifications database for distribution
        notifications.add(emailContent, noop)
      }
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
    Subscription.find({ datasetId: datasetId }).exec((err, subscriptions) => {
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
                  html: commentCreated({
                    name: user.name,
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
                  }),
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
    Subscription.find({ datasetId: datasetId }).exec((err, subscriptions) => {
      // create the email object for each user, using subscription userid and scitran
      subscriptions.forEach(subscription => {
        User.findOne({ id: subscription.userId })
          .exec()
          .then(user => {
            if (user) {
              const emailContent = {
                _id:
                  datasetId + '_' + subscription._id + '_' + 'dataset_deleted',
                type: 'email',
                email: {
                  to: user.email,
                  subject: 'Dataset Deleted',
                  html: datasetDeleted({
                    name: user.name,
                    datasetName: bidsId.decodeId(datasetId),
                    siteUrl:
                      url.parse(config.url).protocol +
                      '//' +
                      url.parse(config.url).hostname,
                  }),
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
    Subscription.find({ datasetId: datasetId }).exec((err, subscriptions) => {
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
                  html: ownerUnsubscribed({
                    name: user.name,
                    datasetName: bidsId.decodeId(datasetId),
                    siteUrl:
                      url.parse(config.url).protocol +
                      '//' +
                      url.parse(config.url).hostname,
                  }),
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
   * Snapshot Reminder
   *
   * Sends an email notification to
   * the uploader of a dataset, informing
   * them that their dataset does not have a snapshot.
   */
  async snapshotReminder(datasetId) {
    console.log(
      'snapshotReminder notification sent with datasetName:',
      bidsId.decodeId(datasetId),
    )

    // get all users that are subscribed to the dataset
    await Subscription.find({ datasetId: datasetId }).exec(
      (err, subscriptions) => {
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
                    'snapshot_reminder',
                  type: 'email',
                  email: {
                    to: user.email,
                    subject: 'Snapshot Reminder',
                    html: snapshotReminder({
                      name: user.name,
                      datasetName: bidsId.decodeId(datasetId),
                      siteUrl:
                        url.parse(config.url).protocol +
                        '//' +
                        url.parse(config.url).hostname,
                      datasetId,
                    }),
                  },
                }
                // send each email to the notification database for distribution
                notifications.add(emailContent, noop)
              }
            })
        })
      },
    )
  },

  /**
   * Import of a remote resource finished
   * @param {string} datasetId
   * @param {string} userId
   * @param {boolean} success
   * @param {string} message
   */
  async datasetImported(datasetId, userId, success, message, retryUrl) {
    const user = await User.findOne({ id: userId }).exec()
    let html
    if (success) {
      html = datasetImportEmail({
        name: user.name,
        datasetId: datasetId,
        siteUrl:
          url.parse(config.url).protocol +
          '//' +
          url.parse(config.url).hostname,
      })
    } else {
      html = datasetImportFailed({
        name: user.name,
        datasetId: datasetId,
        message: success ? '' : message,
        siteUrl:
          url.parse(config.url).protocol +
          '//' +
          url.parse(config.url).hostname,
        retryUrl: retryUrl,
      })
    }
    const emailContent = {
      _id: datasetId + '_' + user._id + '_' + 'dataset_imported',
      type: 'email',
      email: {
        to: user.email,
        subject: `Dataset Import ${success ? 'Success' : 'Failed'}`,
        html: html,
      },
    }
    // send the email to the notifications database for distribution
    notifications.add(emailContent, noop)
  },

  initCron() {
    setInterval(() => {
      // After one hour, retry a notification even if we have a lock
      Notification.findOneAndUpdate(
        { notificationLock: { $lte: toDate(subHours(Date.now(), 1)) } },
        { $set: { notificationLock: new Date(Date.now()) } },
      ).exec((err, notification) => {
        if (err) {
          console.log(
            'NOTIFICATION ERROR - Could not find notifications collection',
          )
        } else {
          if (notification) {
            notifications.send(notification, (err, response) => {
              if (!err) {
                notification.remove()
                if (response && response.messageId) {
                  new MailgunIdentifier({
                    messageId: response.messageId,
                  }).save(err => {
                    if (err) {
                      throw `failed to save mailgunIdentifier ${response.messageId}`
                    }
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
    }, 3600000)
  },
}

export default notifications
