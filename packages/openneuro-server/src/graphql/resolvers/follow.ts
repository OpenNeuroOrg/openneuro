import Subscription from "../../models/subscription"

export const followDataset = async (obj, { datasetId }, { user }) => {
  const following = await Subscription.findOne({
    datasetId,
    userId: user,
  }).exec()
  const newFollower = {
    datasetId,
    userId: user,
  }
  if (following) {
    // unfollow
    return following.deleteOne().then(() => ({
      following: false,
      newFollower,
    }))
  } else {
    const following = new Subscription({ datasetId, userId: user })
    return following.save().then(() => ({
      following: true,
      newFollower,
    }))
  }
}
