import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button } from '@openneuro/components/button'

import { RemovePermissions } from '../mutations/remove-permissions'
import { UpdateDatasetPermissions } from '../mutations/update-permissions'
import { AnonymousReviewer } from './manage-anonymous-reviewers'

const description = {
  admin: 'Edit dataset and edit permissions',
  rw: 'Edit dataset',
  ro: 'View dataset',
}

export const PermissionRow = ({ datasetId, userId, userEmail, access }) => (
  <div className="data-table-content">
    <span>
      <label>Email:</label>
      <a href={`mailto:${userEmail}`}>{userEmail}</a>
    </span>
    <span>
      <label>Access:</label>
      {description[access]}
    </span>
    <span>
      <label>Edit:</label>
      <RemovePermissions datasetId={datasetId} userId={userId} />
    </span>
  </div>
)

PermissionRow.propTypes = {
  datasetId: PropTypes.string,
  userId: PropTypes.string,
  userEmail: PropTypes.string,
  access: PropTypes.oneOf(['ro', 'rw', 'admin']),
}

export const ShareTable = ({ datasetId, permissions }) => (
  <>
    <div className="data-table-header">
      <span>Email</span>
      <span>Access</span>
      <span>Edit</span>
    </div>

    {permissions.userPermissions.map((perm, index) => (
      <PermissionRow
        datasetId={datasetId}
        userId={perm.user.id}
        userEmail={perm.user.email}
        access={perm.level}
        key={index}
      />
    ))}
  </>
)

ShareTable.propTypes = {
  datasetId: PropTypes.string,
  permissions: PropTypes.object,
}

const Share = ({ datasetId, permissions, reviewers }) => {
  const [userEmail, setUserEmail] = useState('')
  const [access, setAccess] = useState('ro')

  const readActive = access === 'ro' && 'active'
  const writeActive = access === 'rw' && 'active'
  const adminActive = access === 'admin' && 'active'

  return (
    <>
      <div className="dataset-share-form container">
        <div className="dataset-form-header">
          <div className="form-group">
            <h2>Share Dataset</h2>
          </div>
          <hr />
          <div className="dataset-form-body">
            <h3>Dataset shared with:</h3>
            <ShareTable datasetId={datasetId} permissions={permissions} />
            <p>
              Enter a user&#39;s email address and select access level to share
            </p>
            <div className="share-input-group">
              <input
                className="form-control"
                type="email"
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
              />
              <div className="input-group-btn">
                <Button
                  secondary={true}
                  label="Read"
                  size="xsmall"
                  className={`btn btn-default ${readActive}`}
                  onClick={() => setAccess('ro')}
                />
                <Button
                  secondary={true}
                  label="Read and Write"
                  size="xsmall"
                  className={`btn btn-default ${writeActive}`}
                  onClick={() => setAccess('rw')}
                />
                <Button
                  secondary={true}
                  label="Admin"
                  size="xsmall"
                  className={`btn btn-default ${adminActive}`}
                  onClick={() => setAccess('admin')}
                />
              </div>
            </div>
          </div>
          <div className="share-form-controls">
            <UpdateDatasetPermissions
              datasetId={datasetId}
              userEmail={userEmail}
              metadata={access}
              done={() => setUserEmail('')}
            />
            <Link className="return-link" to={`/datasets/${datasetId}`}>
              Return to Dataset
            </Link>
          </div>
        </div>
      </div>
      <br />
      <AnonymousReviewer datasetId={datasetId} reviewers={reviewers} />
    </>
  )
}

Share.propTypes = {
  datasetId: PropTypes.string,
  permissions: PropTypes.object,
}

export default Share
