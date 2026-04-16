import Dataset from "../../models/dataset"

/**
 * Toggle the holdDeletion flag on a dataset to prevent automated deletion.
 * Requires site admin access.
 */
export async function holdDeletion(
  _obj: Record<string, unknown>,
  { datasetId, hold }: { datasetId: string; hold: boolean },
  { userInfo }: { userInfo: { admin: boolean } },
): Promise<boolean> {
  if (userInfo?.admin && datasetId.length === 8 && datasetId.startsWith("ds")) {
    try {
      await Dataset.updateOne({ id: datasetId }, { holdDeletion: hold }).exec()
      return true
    } catch (_err) {
      return false
    }
  }
  return false
}
