/**
 * Resolver for rerunning remote exports.
 */
import { checkAdmin } from '../permissions'
import { runReexporter, CHECK } from '../../datalad/reexporter'

export const reexportRemotes = async (obj, {}, { user, userInfo }) => {
  await checkAdmin(user, userInfo)
  await runReexporter()
  return true
}
