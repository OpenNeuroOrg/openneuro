import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import UpdateDatasetPermissions from '../mutations/update-permissions.jsx'
import RemovePermissions from '../mutations/remove-permissions.jsx'

const description = {
  admin: 'Edit dataset and edit permissions',
  rw: 'Edit dataset',
  ro: 'View dataset',
}

export const PermissionRow = ({ datasetId, userId, userEmail, access }) => (
  <tr>
    <td className="col-xs-4">{userEmail}</td>
    <td className="col-xs-2">{description[access]}</td>
    <td className="col-xs-2">
      <RemovePermissions datasetId={datasetId} userId={userId} />
    </td>
  </tr>
)

PermissionRow.propTypes = {
  datasetId: PropTypes.string,
  userId: PropTypes.string,
  userEmail: PropTypes.string,
  access: PropTypes.oneOf(['ro', 'rw', 'admin']),
}

export const ShareTable = ({ datasetId, permissions }) => (
  <table className="table">
    <thead>
      <tr>
        <th>Email</th>
        <th>Access</th>
        <th>Edit</th>
      </tr>
    </thead>
    <tbody>
      {permissions.userPermissions.map((perm, index) => (
        <PermissionRow
          datasetId={datasetId}
          userId={perm.user.id}
          userEmail={perm.user.email}
          access={perm.level}
          key={index}
        />
      ))}
    </tbody>
  </table>
)

ShareTable.propTypes = {
  datasetId: PropTypes.string,
  permissions: PropTypes.object,
}

const Share = ({ datasetId, permissions }) => {
  const [userEmail, setUserEmail] = useState('')
  const [access, setAccess] = useState('ro')

  const readActive = access === 'ro' && 'active'
  const writeActive = access === 'rw' && 'active'
  const adminActive = access === 'admin' && 'active'

  return (
    <div className="dataset-form">
      <div className="col-xs-12 dataset-form-header">
        <div className="form-group">
          <label>Share Dataset</label>
        </div>
        <hr />
        <div className="col-xs-12 dataset-form-body">
          <p>Dataset shared with:</p>
          <ShareTable datasetId={datasetId} permissions={permissions} />
          <p>
            Enter a user&#39;s email address and select access level to share
          </p>
          <div className="input-group">
            <input
              className="form-control"
              type="email"
              value={userEmail}
              onChange={e => setUserEmail(e.target.value)}
            />
            <div className="input-group-btn">
              <button
                className={`btn btn-default ${readActive}`}
                onClick={() => setAccess('ro')}>
                Read
              </button>
              <button
                className={`btn btn-default ${writeActive}`}
                onClick={() => setAccess('rw')}>
                Read and Write
              </button>
              <button
                className={`btn btn-default ${adminActive}`}
                onClick={() => setAccess('admin')}>
                Admin
              </button>
            </div>
          </div>
        </div>
        <div className="col-xs-12 dataset-form-controls">
          <div className="col-xs-12 modal-actions">
            <Link to={`/datasets/${datasetId}`}>
              <button className="btn-admin-blue">Return to Dataset</button>
            </Link>
            <UpdateDatasetPermissions
              datasetId={datasetId}
              userEmail={userEmail}
              metadata={access}
              done={() => setUserEmail('')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

Share.propTypes = {
  datasetId: PropTypes.string,
  permissions: PropTypes.object,
}

export default Share
