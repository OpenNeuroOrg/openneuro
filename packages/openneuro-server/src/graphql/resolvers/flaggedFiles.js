import BadAnnexObject from '../../models/badAnnexObject'
import { checkAdmin } from '../permissions'

export const flaggedFiles = async (
  obj,
  { deleted = false },
  { user, userInfo },
) => {
  await checkAdmin(user, userInfo)
  return BadAnnexObject.find({ flagged: true, removed: deleted })
    .populate('flagger')
    .populate('remover')
}
