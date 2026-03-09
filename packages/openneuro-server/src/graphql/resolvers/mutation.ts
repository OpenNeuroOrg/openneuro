/**
 * All top level mutations
 */
import {
  createDataset,
  deleteDataset,
  deleteFiles,
  flagAnnexObject,
  removeAnnexObject,
  trackAnalytics,
  updatePublic,
} from "./dataset"
import {
  createSnapshot,
  deleteSnapshot,
  deprecateSnapshot,
  undoDeprecateSnapshot,
} from "./snapshots"
import { removeUser, setAdmin, setBlocked, updateUser } from "./user"
import { updateSummary } from "./summary"
import { revalidate, updateValidation } from "./validation"
import {
  removePermissions,
  updateOrcidPermissions,
  updatePermissions,
} from "./permissions"
import { followDataset } from "./follow"
import { starDataset } from "./stars"
import { publishDataset } from "./publish"
import { updateDescription, updateDescriptionList } from "./description"
import { updateReadme } from "./readme"
import { addComment, deleteComment, editComment } from "./comment"
import { subscribeToNewsletter } from "./newsletter"
import { addMetadata } from "./metadata"
import { finishUpload, prepareUpload } from "./upload"
import { prepareRepoAccess } from "./git"
import { cacheClear } from "./cache"
import { reexportRemotes } from "./reexporter"
import { resetDraft } from "./reset"
import { createReviewer, deleteReviewer } from "./reviewer"
import { createRelation, deleteRelation } from "./relation"
import {
  finishImportRemoteDataset,
  importRemoteDataset,
} from "./importRemoteDataset"
import {
  createContributorCitationEvent,
  createContributorRequestEvent,
  processContributorCitation,
  processContributorRequest,
  saveAdminNote,
  updateEventStatus,
} from "./datasetEvents"
import { createGitEvent } from "./gitEvents"
import { fsckDataset, updateFileCheck } from "./fileCheck"
import { updateContributors } from "../../datalad/contributors"
import { updateWorkerTask } from "./worker"

const Mutation = {
  createDataset,
  deleteDataset,
  deleteFiles,
  removeAnnexObject,
  flagAnnexObject,
  createSnapshot,
  deprecateSnapshot,
  undoDeprecateSnapshot,
  deleteSnapshot,
  updateSummary,
  updateValidation,
  updatePublic,
  updatePermissions,
  updateOrcidPermissions,
  removePermissions,
  removeUser,
  setAdmin,
  setBlocked,
  trackAnalytics,
  followDataset,
  starDataset,
  publishDataset,
  updateDescription,
  updateDescriptionList,
  updateReadme,
  addComment,
  editComment,
  deleteComment,
  subscribeToNewsletter,
  addMetadata,
  prepareUpload,
  finishUpload,
  cacheClear,
  revalidate,
  fsckDataset,
  prepareRepoAccess,
  reexportRemotes,
  resetDraft,
  createReviewer,
  deleteReviewer,
  createRelation,
  deleteRelation,
  importRemoteDataset,
  finishImportRemoteDataset,
  updateUser,
  saveAdminNote,
  createContributorRequestEvent,
  createContributorCitationEvent,
  processContributorRequest,
  processContributorCitation,
  createGitEvent,
  updateFileCheck,
  updateEventStatus,
  updateContributors,
  updateWorkerTask,
}

export default Mutation
