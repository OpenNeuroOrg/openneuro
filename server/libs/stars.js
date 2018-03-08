import mongo from './mongo'

/**
 * Stars
 *
 * A helper library for updating dataset star values
 */
export default {
    /**
   * Get Stars
   *
   * Takes a datasetId and callsback with the number
   * of stars the dataset currently has
   */
  getStars(datasetId, callback) {
    mongo.collections.crn.stars.find(
      { _id: datasetId },
      (err, doc) => {
        if (err) {
          callback(err, null)
        } else {
          callback(null, doc.value.stars)
        }
      },
    )
  },

  /**
   * Add Star
   *
   * Takes a datasetId and callsback with the next integer number
   * of stars for that dataset
   */
  addStar(datasetId, callback) {
    mongo.collections.crn.stars.findAndModify(
      { _id: datasetId },
      [],
      { $inc: { stars: 1 } },
      { new: true, upsert: true },
      (err, doc) => {
        if (err) {
          callback(err, null)
        } else {
          callback(null, doc.value.stars)
        }
      },
    )
  },

  /**
   * Remove Star
   *
   * Takes a datasetId and callsback with one less integer number
   * of stars for that dataset
   */
  removeStar(datasetId, callback) {
    mongo.collections.crn.stars.findAndModify(
      { _id: datasetId },
      [],
      { $inc: { stars: -1 } },
      { new: true, upsert: true },
      (err, doc) => {
        if (err) {
          callback(err, null)
        } else {
          callback(null, doc.value.stars)
        }
      },
    )
  },
}
