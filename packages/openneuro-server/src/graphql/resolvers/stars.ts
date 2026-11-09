import Star from "../../models/stars"
import type { GraphQLContext } from "../builder"
import { checkDatasetRead } from "../permissions"

export const starDataset = async (
  obj,
  { datasetId },
  { user, userInfo }: GraphQLContext,
) => {
  if (!user) {
    throw new Error("You must be logged in to star a dataset.")
  }
  await checkDatasetRead(datasetId, user, userInfo)
  const star = await Star.findOne({ datasetId, userId: user }).exec()
  const newStar = {
    datasetId,
    userId: user,
  }
  if (star) {
    // unstar
    return star.deleteOne().then(() => ({
      starred: false,
      newStar,
    }))
  } else {
    const star = new Star({ datasetId, userId: user })
    return star.save().then(() => ({
      starred: true,
      newStar,
    }))
  }
}
