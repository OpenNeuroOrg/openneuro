import DeprecatedSnapshot from '../../models/deprecatedSnapshot'
import { checkDatasetAdmin } from '../permissions.js'
import Snapshot from '../../models/snapshot'
import User from '../../models/user'
import * as Sentry from '@sentry/node'

export const deprecated = snapshot => {
  return DeprecatedSnapshot.findOne({ id: snapshot.hexsha }).populate('user')
}

export const deprecateSnapshot = async (
  obj,
  { datasetId, tag, reason },
  { user, userInfo },
) => {
  try {
    await checkDatasetAdmin(datasetId, user, userInfo)
    const [snapshot, userDoc] = await Promise.all([
      Snapshot.findOne({ datasetId, tag }),
      User.findOne({ id: user }),
    ])
    await DeprecatedSnapshot.create({
      id: snapshot.hexsha,
      user: userDoc._id,
      cause: reason,
      timestamp: new Date(),
    })
    return true
  } catch (err) {
    Sentry.captureException(err)
    throw err
  }
}
