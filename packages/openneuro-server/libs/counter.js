import mongo from './mongo'

/**
 * Counter
 *
 * A helper library for getting persistent serial numbers.
 */
export default {
  /**
   * Get Next
   *
   * Takes any string as a type and callsback with the next
   * sequential integer for that type starting with 1.
   */
  getNext(type, callback) {
    mongo.collections.crn.counters.findOneAndUpdate(
      { _id: type },
      { $inc: { sequence_value: 1 } },
      { returnOriginal: false, upsert: true },
      (err, doc) => {
        callback(doc.value.sequence_value)
      },
    )
  },
}
