import Star from '../../models/stars'

export const starDataset = async (obj, { datasetId }, { user }) => {
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
