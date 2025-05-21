import React from "react"
import FileSelect from "./file-select"
import UploaderContext from "./uploader-context.js"
import { useUser } from "../queries/user"

const UploadSelect = () => {
  const { user, loading, error } = useUser()
  const disabled = loading || Boolean(error) || !user || !user.email
  const noEmail = !(user?.email)
  return (
    <div>
      <UploaderContext.Consumer>
        {(uploader) => (
          <div className="message fade-in">
            <p>
              To protect the privacy of the individuals who have been scanned,
              we require that all scan data be defaced before publishing a
              dataset.
            </p>
            Select a{" "}
            <a
              href="http://bids.neuroimaging.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              BIDS dataset
            </a>{" "}
            to upload
            <FileSelect onChange={uploader.selectFiles} disabled={disabled} />
            {noEmail && (
              <p>
                Connect a contact email to upload. See our{" "}
                <a href="https://docs.openneuro.org/orcid.html#enabling-trusted-access-to-emails">
                  ORCID documentation
                </a>{" "}
                for instructions.
              </p>
            )}
          </div>
        )}
      </UploaderContext.Consumer>
    </div>
  )
}

export default UploadSelect
