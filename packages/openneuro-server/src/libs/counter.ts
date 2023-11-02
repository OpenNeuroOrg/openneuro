import Counter from '../models/counter'

/**
 * Counter
 *
 * A helper library for getting persistent serial numbers.
 */
export async function getNext(type) {
  const found = await Counter.findOne({ _id: type }).exec()
  if (found) {
    await Counter.updateOne(
      { _id: type },
      { $inc: { sequence_value: 1 } },
    ).exec()
    return found.sequence_value + 1
  } else {
    const counter = new Counter({ _id: type, sequence_value: 1 })
    await counter.save()
    return 1
  }
}
