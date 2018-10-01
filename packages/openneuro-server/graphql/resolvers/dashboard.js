import * as datasets from '../../datalad/dataset.js'
import * as snapshots from '../../datalad/snapshots.js'

export const myDatasets = (parent, args, { user }) => {
  if (user) {
    return datasets.getDatasets({ userId: user })
  } else {
    throw new Error('You must be logged in to view user-specific datasets.')
  }
}

export const adminDatasets = (parent, args, { user, userInfo }) => {
  if (userInfo.admin) {
    return datasets.getDatasets({ userId: user, admin: userInfo.admin })
  } else {
    throw new Error(
      'You must have administrator privileges to view the admin dashboard.',
    )
  }
}

export const publicDatasets = () => {
  return snapshots.getPublicSnapshots()
}
