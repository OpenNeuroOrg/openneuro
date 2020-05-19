import Subscription from '../../models/subscription.js'

export const followDataset = async (obj, { datasetId }, { user }) => {
  const following = await Subscription.findOne({
    datasetId,
    userId: user,
  }).exec()
  if (following) {
    // unfollow
    return following.remove().then(() => false)
  } else {
    const following = new Subscription({ datasetId, userId: user })
    return following.save().then(() => true)
  }
}
