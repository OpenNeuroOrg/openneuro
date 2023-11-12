/*eslint no-console: ["error", { allow: ["log"] }] */
import config from "../config"
import { send as emailSend } from "./email"
import request from "superagent"
import User from "../models/user"
import Subscription from "../models/subscription"
import { format } from "date-fns"
import url from "url"
import { convertFromRaw, EditorState } from "draft-js"
import { stateToHTML } from "draft-js-export-html"
import { getDatasetWorker } from "./datalad-service"
import { commentCreated } from "./email/templates/comment-created"
import { datasetDeleted } from "./email/templates/dataset-deleted"
import { ownerUnsubscribed } from "./email/templates/owner-unsubscribed"
import { snapshotCreated } from "./email/templates/snapshot-created"
import { snapshotReminder } from "./email/templates/snapshot-reminder"
import { datasetImportEmail } from "./email/templates/dataset-imported"
import { datasetImportFailed } from "./email/templates/dataset-import-failed"

// public api ---------------------------------------------

const notifications = {
  /**
   * Send
   */
  send(notification) {
    if (notification.type === "email") {
      emailSend(notification.email)
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
    const datasetDescriptionUrl =
      `${URI}/datasets/${datasetId}/snapshots/${tag}/files/dataset_description.json`
    const changesUrl =
      `${URI}/datasets/${datasetId}/snapshots/${tag}/files/CHANGES`

    // get the dataset description
    const descriptionResponse = await request.get(datasetDescriptionUrl)
    const description = descriptionResponse.body
    const datasetLabel = description.Name ? description.Name : "Unnamed Dataset"

    // get the snapshot changelog
    const changesResponse = await request
      .get(changesUrl)
      .responseType("application/octet-stream")
    const changelog = changesResponse.body
      ? changesResponse.body.toString()
      : null
    // get all users that are subscribed to the dataset
    const subscriptions = await Subscription.find({
      datasetId: datasetId,
    }).exec()
    // create the email object for each user
    subscriptions.forEach(async (subscription) => {
      const user = await User.findOne({ id: subscription.userId }).exec()
      if (user && user.id !== uploaderId) {
        const emailContent = {
          _id: datasetId + "_" + user._id + "_" + "snapshot_created",
          type: "email",
          email: {
            to: user.email,
            name: user.name,
            subject: "Snapshot Created",
            html: snapshotCreated({
              name: user.name,
              datasetLabel: datasetLabel,
              datasetId: datasetId,
              versionNumber: tag,
              changelog: changelog,
              siteUrl: url.parse(config.url).protocol +
                "//" +
                url.parse(config.url).hostname,
            }),
          },
        }
        // send the email
        notifications.send(emailContent)
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
    const userId = comment.user && comment.user.email
      ? comment.user.email
      : null
    const content = comment.text
    const commentId = comment._id ? comment._id : null
    const isReply = comment.parentId ? comment.parentId : null
    const commentStatus = isReply ? "reply to a comment" : "comment"
    const editorState = EditorState.createWithContent(
      convertFromRaw(JSON.parse(content)),
    )
    const contentState = editorState.getCurrentContent()
    const htmlContent = stateToHTML(contentState)

    // get all users that are subscribed to the dataset
    Subscription.find({ datasetId: datasetId })
      .exec()
      .then((subscriptions) => {
        // create the email object for each user, using subscription userid and scitran
        subscriptions.forEach((subscription) => {
          User.findOne({ id: subscription.userId })
            .exec()
            .then((user) => {
              if (user && user.email !== userId) {
                const emailContent = {
                  _id: datasetId +
                    "_" +
                    subscription._id +
                    "_" +
                    comment._id +
                    "_" +
                    "comment_created",
                  type: "email",
                  email: {
                    to: user.email,
                    name: user.name,
                    from: "reply-" +
                      encodeURIComponent(comment._id) +
                      "-" +
                      encodeURIComponent(user._id),
                    subject: "Comment Created",
                    html: commentCreated({
                      name: user.name,
                      datasetName: datasetId,
                      datasetLabel: datasetLabel,
                      commentUserId: userId,
                      commentId: commentId,
                      dateCreated: format(comment.createDate, "MMMM Do"),
                      commentContent: htmlContent,
                      commentStatus: commentStatus,
                      siteUrl: url.parse(config.url).protocol +
                        "//" +
                        url.parse(config.url).hostname,
                    }),
                  },
                }
                // send each email to the notification database for distribution
                notifications.send(emailContent)
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
    console.log("datasetDeleted notification sent with datasetName:", datasetId)

    // get all users that are subscribed to the dataset
    Subscription.find({ datasetId: datasetId })
      .exec()
      .then((subscriptions) => {
        // create the email object for each user, using subscription userid and scitran
        subscriptions.forEach((subscription) => {
          User.findOne({ id: subscription.userId })
            .exec()
            .then((user) => {
              if (user) {
                const emailContent = {
                  _id: datasetId +
                    "_" +
                    subscription._id +
                    "_" +
                    "dataset_deleted",
                  type: "email",
                  email: {
                    to: user.email,
                    name: user.name,
                    subject: "Dataset Deleted",
                    html: datasetDeleted({
                      name: user.name,
                      datasetName: datasetId,
                      siteUrl: url.parse(config.url).protocol +
                        "//" +
                        url.parse(config.url).hostname,
                    }),
                  },
                }
                notifications.send(emailContent)
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
      "ownerUnsubscribed notification sent with datasetName:",
      datasetId,
    )

    // get all users that are subscribed to the dataset
    Subscription.find({ datasetId: datasetId })
      .exec()
      .then((subscriptions) => {
        // create the email object for each user, using subscription userid and scitran
        subscriptions.forEach((subscription) => {
          User.findOne({ id: subscription.userId })
            .exec()
            .then((user) => {
              if (user) {
                const emailContent = {
                  _id: datasetId +
                    "_" +
                    subscription._id +
                    "_" +
                    "owner_unsubscribed",
                  type: "email",
                  email: {
                    to: user.email,
                    name: user.name,
                    subject: "Owner Unsubscribed",
                    html: ownerUnsubscribed({
                      name: user.name,
                      datasetName: datasetId,
                      siteUrl: url.parse(config.url).protocol +
                        "//" +
                        url.parse(config.url).hostname,
                    }),
                  },
                }
                notifications.send(emailContent)
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
      "snapshotReminder notification sent with datasetName:",
      datasetId,
    )

    // get all users that are subscribed to the dataset
    await Subscription.find({ datasetId: datasetId })
      .exec()
      .then((subscriptions) => {
        // create the email object for each user, using subscription userid and scitran
        subscriptions.forEach((subscription) => {
          User.findOne({ id: subscription.userId })
            .exec()
            .then((user) => {
              if (user) {
                const emailContent = {
                  _id: datasetId +
                    "_" +
                    subscription._id +
                    "_" +
                    "snapshot_reminder",
                  type: "email",
                  email: {
                    to: user.email,
                    name: user.name,
                    subject: "Snapshot Reminder",
                    html: snapshotReminder({
                      name: user.name,
                      datasetName: datasetId,
                      siteUrl: url.parse(config.url).protocol +
                        "//" +
                        url.parse(config.url).hostname,
                      datasetId,
                    }),
                  },
                }
                // send each email to the notification database for distribution
                notifications.send(emailContent)
              }
            })
        })
      })
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
        siteUrl: url.parse(config.url).protocol +
          "//" +
          url.parse(config.url).hostname,
      })
    } else {
      html = datasetImportFailed({
        name: user.name,
        datasetId: datasetId,
        message: success ? "" : message,
        siteUrl: url.parse(config.url).protocol +
          "//" +
          url.parse(config.url).hostname,
        retryUrl: retryUrl,
      })
    }
    const emailContent = {
      _id: datasetId + "_" + user._id + "_" + "dataset_imported",
      type: "email",
      email: {
        to: user.email,
        name: user.name,
        subject: `Dataset Import ${success ? "Success" : "Failed"}`,
        html: html,
      },
    }
    // send the email to the notifications database for distribution
    notifications.send(emailContent)
  },
}

export default notifications
