import Subscription from "../../models/subscription"
import type { GraphQLContext } from "../builder"
import { checkDatasetRead } from "../permissions"

export const followDataset = async (
  obj,
  { datasetId },
  { user, userInfo }: GraphQLContext,
) => {
  if (!user) {
    throw new Error("You must be logged in to follow a dataset.")
  }
  await checkDatasetRead(datasetId, user, userInfo)
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
