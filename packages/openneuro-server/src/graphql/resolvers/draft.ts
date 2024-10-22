import Summary from "../../models/summary"
import { summary } from "./summary"
import { issues } from "./issues.js"
import { description } from "./description.js"
import { readme } from "./readme.js"
import { getDraftRevision, updateDatasetRevision } from "../../datalad/draft.js"
import { checkDatasetWrite } from "../permissions.js"
import { getFiles } from "../../datalad/files"
import { filterRemovedAnnexObjects } from "../utils/file.js"

// A draft must have a dataset parent
const draftFiles = async (dataset, args, { userInfo }) => {
  const hexsha = await getDraftRevision(dataset.id)
  const files = await getFiles(dataset.id, args.tree || hexsha)
  return filterRemovedAnnexObjects(dataset.id, userInfo)(files)
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const draftSize = async (dataset, args, { userInfo }) => {
  const hexsha = await getDraftRevision(dataset.id)
  return Summary.findOne({ datasetId: dataset.id, id: hexsha })
    .exec()
    .then((res) => res?.toObject()?.size)
}

/**
 * Deprecated mutation to move the draft HEAD reference forward or backward
 *
 * Exists to support existing usage where this would result in the initial snapshot
 */
export const updateRef = async (
  obj,
  { datasetId, ref },
  { user, userInfo },
) => {
  await checkDatasetWrite(datasetId, user, userInfo)
  await updateDatasetRevision(datasetId)
}

/**
 * Mutation to move the draft HEAD reference forward or backward
 */
export const revalidate = async (obj, { datasetId }, { user, userInfo }) => {
  await checkDatasetWrite(datasetId, user, userInfo)
}

const draft = {
  id: (obj) => obj.id,
  files: draftFiles,
  size: draftSize,
  summary,
  issues,
  modified: (obj) => obj.modified,
  description,
  readme,
  head: (obj) => obj.revision,
}

export default draft
