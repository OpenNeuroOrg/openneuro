/*eslint no-console: ["error", { allow: ["log"] }] */

import config from '../config'
import cron from 'cron'
import mongo from './mongo'
import email from './email'
import scitran from './scitran'
import moment from 'moment'
import url from 'url'
import bidsId from './bidsId'

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
  snapshotCreated(datasetId, versionNumber, snapshotId) {
    console.log('snapshotCreated notification sent with datasetId:', bidsId.decodeId(datasetId), 'versionNumber:', versionNumber, 'and snapshotId:', snapshotId)

    // get all users that are subscribed to the dataset
    c.crn.subscriptions.find({datasetId: datasetId}).toArray((err, users) => {

      // create the email object for each user
      let emails = users.map(user => {
        let emailContent = {
          _id: null,
          type: 'email',
          email: {
            to: user.email,
            subject: '',
            template: 'snapshot-created',
            data: {
              firstName: user.firstname,
              lastName: user.lastname,
              datasetName: '',
              versionNumber: versionNumber,
              datasetId: bidsId.decodeId(datasetId),
              snapshotId: snapshotId ,
              siteUrl:
              url.parse(config.url).protocol +
              '//' +
              url.parse(config.url).hostname,
            }
          }
        }
        return emailContent
      })

      // send each email to the notification database for distribution
      emails.forEach((email) => {
        notifications.add(email, () => {})
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

    // get all users that are subscribed to the dataset
    c.crn.subscriptions.find({datasetId: comment.datasetId}).toArray((err, users) => {
      let emails = users.map(user => {
        let emailContent = {
          _id: null,
          type: 'email',
          email: {
            to: user.email,
            subject: '',
            template: 'comment-created',
            data: {
              firstName: user.firstname,
              lastName: user.lastname,
              datasetName: '',
              comment: comment,
            }
          }
        }
        return emailContent      
      })
      
      // send each email to the notification database for distribution
      emails.forEach((email) => {
        notifications.add(email, () => {})
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
