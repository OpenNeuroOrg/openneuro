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
 * Generic download issues
 */
export const nativeErrorToast = () => {
  toast.error(
    <ToastContent title="Download Error" body="An error occurred writing files">
      <p>
        Make sure you have enough free disk space and permission to write to the
        dataset.
      </p>
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
  )
}
