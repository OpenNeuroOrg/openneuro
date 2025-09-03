import WorkerTask from "../../models/worker-task"
import { checkWorker } from "../permissions"

/**
 * Update a worker task record
 *
 * This can be called for new tasks, or to update existing tasks.
 */
export const updateWorkerTask = async (obj, args, { userInfo }) => {
  checkWorker(userInfo)
  const { id, ...updateData } = args

  // Don't allow null values to unset fields
  const update = Object.fromEntries(
    Object.entries(updateData).filter(([, value]) => value != null),
  )

  const task = await WorkerTask.findOneAndUpdate({ id }, { $set: update }, {
    new: true,
    upsert: true,
  }).exec()
  return task
}
