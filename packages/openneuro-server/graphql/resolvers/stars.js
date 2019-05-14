import Star from '../../models/stars.js'

export const starDataset = async (obj, { datasetId }, { user }) => {
  const star = await Star.findOne({ datasetId, userId: user }).exec()
  if (star) {
    // unstar
    return star.remove().then(() => false)
  } else {
    const star = new Star({ datasetId, userId: user })
    return star.save().then(() => true)
  }
}
