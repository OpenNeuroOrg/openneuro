import React from 'react'
import { toast } from 'react-toastify'
import ToastContent from '../../common/partials/toast-content.jsx'

/**
 * Write failures due to permissions (most likely)
 */
export const permissionsToast = () => {
  toast.error(
    <ToastContent title="Permission Error" body="Write permissions denied">
      <p>Browser write permissions are required for downloads.</p>
    </ToastContent>,
  )
}

/**
 * Write failures due to a user event
 */
export const downloadAbortToast = () => {
  toast.error(
    <ToastContent title="Download Canceled">
      <p>
        To retry your download click the download button and reselect the target
        directory.
      </p>
    </ToastContent>,
  )
}

/**
 * Generic download issues
 */
export const nativeErrorToast = () => {
  toast.error(
    <ToastContent title="Download Error" body="An error occurred writing files">
      <p>
        Make sure you have enough free disk space and permission to write to the
        local directory.
      </p>
    </ToastContent>,
  )
}

export const requestFailureToast = () => {
  toast.error(
    <ToastContent title="Download Error" body="A file failed to download">
      <p>You may not have access to download this dataset.</p>
    </ToastContent>,
  )
}

/**
 * Let the user know their download is done
 * @param {string} dirName
 */
export const downloadCompleteToast = dirName => {
  toast.success(
    <ToastContent
      title="Download Complete"
      body={`See "${dirName}" directory for downloaded files`}></ToastContent>,
    { autoClose: false },
  )
}

/**
 * Show download progress
 * @param {string} dirName Local directory chosen
 * @param {string} datasetId Dataset identifier
 * @param {string} snapshotId Snapshot identifier
 */
export const downloadToast = (dirName, datasetId, snapshotId, onClose) => {
  const downloadMessage = snapshotId
    ? `Copying ${datasetId} snapshot ${snapshotId} to local folder ${dirName}`
    : `Copying ${datasetId} to local folder ${dirName}`
  return toast(
    <ToastContent title={'Downloading'} body={downloadMessage}></ToastContent>,
    {
      progress: 0,
      hideProgressBar: false,
      autoClose: false,
      closeOnClick: false,
      onClose,
    },
  )
}

export const downloadToastUpdate = (toastId, progress) =>
  toast.update(toastId, { progress })

export const downloadToastDone = toastId => toast.done(toastId)
