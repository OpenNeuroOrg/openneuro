import Counter from '../models/counter.js'

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
    Counter.findOneAndUpdate(
      { _id: type },
      {
        $inc: { sequence_value: 1 },
        $setOnInsert: { _id: type, sequence_value: 1 },
      },
      { new: true, upsert: true },
      (err, doc) => {
        callback(doc.sequence_value)
      },
    )
  },
}
