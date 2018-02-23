/*eslint no-console: ["error", { allow: ["log"] }] */

import config from '../config'
import cron from 'cron'
import mongo from './mongo'
import email from './email'
import scitran from './scitran'
import moment from 'moment'
import url from 'url'
import bidsId from './bidsId'
import {convertFromRaw, EditorState} from 'draft-js'
import {stateToHTML} from 'draft-js-export-html'

let c = mongo.collections

// public api ---------------------------------------------

let notifications = {
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
    scitran.getUser(job.userId, (err, res) => {
      let user = res.body
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
              firstName: user.firstname,
              lastName: user.lastname,
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
        () => {},
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
  snapshotCreated(datasetId, versionNumber) {

    scitran.getProject(datasetId, (err, resp) => {
      let datasetLabel = (resp.body && resp.body.label) ? resp.body.label : datasetId

      // get all users that are subscribed to the dataset
      c.crn.subscriptions.find({datasetId: datasetId}).toArray((err, subscriptions) => {

        // create the email object for each user
        subscriptions.forEach(subscription => {
          scitran.getUser(subscription.userId, (err, res) => {
            let user = res.body
            let emailContent = {
              _id: datasetId + '_' + user._id + '_' + 'snapshot_created',
              type: 'email',
              email: {
                to: user.email,
                subject: 'Snapshot Created',
                template: 'snapshot-created',
                data: {
                  firstName: user.firstname,
                  lastName: user.lastname,
                  datasetLabel: datasetLabel,
                  datasetId: bidsId.decodeId(datasetId),
                  versionNumber: versionNumber,
                  siteUrl:
                  url.parse(config.url).protocol +
                  '//' +
                  url.parse(config.url).hostname,
                }
              }
            }
            // send the email to the notifications database for distribution
            notifications.add(emailContent, () => {})
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
    let datasetId = comment.datasetId ? comment.datasetId : null
    let datasetLabel = comment.datasetLabel ? comment.datasetLabel : comment.datasetId
    let userId = (comment.user && comment.user.email) ? comment.user.email : null
    let content = comment.text
    let commentId = comment._id ? comment._id : null
    let isReply = comment.parentId ? comment.parentId : null
    let commentStatus = isReply ? 'reply to a comment' : 'comment'
    let editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(content)))
    let contentState = editorState.getCurrentContent()
    let htmlContent = stateToHTML(contentState)

    // get all users that are subscribed to the dataset
    c.crn.subscriptions.find({datasetId: datasetId}).toArray((err, subscriptions) => {

      // create the email object for each user, using subscription userid and scitran
      subscriptions.forEach(subscription => {
        scitran.getUser(subscription.userId, (err, res) => {
          let user = res.body
          if (user.email !== comment.user.email) {
            let emailContent = {
              _id: datasetId + '_' + subscription._id + '_' + comment._id + '_' + 'comment_created',
              type: 'email',
              email: {
                to: user.email,
                subject: 'Comment Created',
                template: 'comment-created',
                data: {
                  firstName: user.firstname,
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
                }
              }
            }
            // send each email to the notification database for distribution
            notifications.add(emailContent, () => {})
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
    console.log('datasetDeleted notification sent with datasetName:', bidsId.decodeId(datasetId))

    // get all users that are subscribed to the dataset
    c.crn.subscriptions.find({datasetId: datasetId}).toArray((err, subscriptions) => {

      // create the email object for each user, using subscription userid and scitran
      subscriptions.forEach(subscription => {
        scitran.getUser(subscription.userId, (err, res) => {
          console.log('scitran user:', res.body)
          let user = res.body
          let emailContent = {
            _id: datasetId + '_' + subscription._id + '_' + 'dataset_deleted',
            type: 'email',
            email: {
              to: user.email,
              subject: 'Dataset Deleted',
              template: 'dataset-deleted',
              data: {
                firstName: user.firstname,
                lastName: user.lastname,
                datasetName: bidsId.decodeId(datasetId),
                siteUrl:
                url.parse(config.url).protocol +
                '//' +
                url.parse(config.url).hostname,
              }
            }
          }
          // send each email to the notification database for distribution
          notifications.add(emailContent, () => {})
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
    console.log('ownerUnsubscribed notification sent with datasetName:', bidsId.decodeId(datasetId))

    // get all users that are subscribed to the dataset
    c.crn.subscriptions.find({datasetId: datasetId}).toArray((err, subscriptions) => {

      // create the email object for each user, using subscription userid and scitran
      subscriptions.forEach(subscription => {
        scitran.getUser(subscription.userId, (err, res) => {
          console.log('scitran user:', res.body)
          let user = res.body
          let emailContent = {
            _id: datasetId + '_' + subscription._id + '_' + 'owner_unsubscribed',
            type: 'email',
            email: {
              to: user.email,
              subject: 'Owner Unsubscribed',
              template: 'owner-unsubscribed',
              data: {
                firstName: user.firstname,
                lastName: user.lastname,
                datasetName: bidsId.decodeId(datasetId),
                siteUrl:
                url.parse(config.url).protocol +
                '//' +
                url.parse(config.url).hostname,
              }
            }
          }
          // send each email to the notification database for distribution
          notifications.add(emailContent, () => {})
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
          for (let notification of docs) {
            notifications.send(notification, err => {
              if (!err) {
                c.crn.notifications.removeOne(
                  { _id: notification._id },
                  {},
                  () => {},
                )
              } else {
                console.log('NOTIFICATION ERROR ----------')
                console.log(err)
              }
            })
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
