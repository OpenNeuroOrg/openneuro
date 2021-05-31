import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import snapshotVersion from '../snapshotVersion.js'
import WarnButton from '../../common/forms/warn-button.jsx'
import FollowDataset from '../mutations/follow.jsx'
import StarDataset from '../mutations/star.jsx'
import ShareDatasetLink from '../fragments/share-dataset-button.jsx'
import DatasetMetadata from './metadata-tool.jsx'
import LoggedIn from '../../authentication/logged-in.jsx'
import DeletePage from '../dataset/delete-page.jsx'
import AdminUser from '../../authentication/admin-user.jsx'
import {
  getProfile,
  hasEditPermissions,
} from '../../refactor_2021/authentication/profile.js'
import {
  Overlay,
  ModalContainer,
  ExitButton,
} from '../../styles/support-modal.jsx'
import { Media } from '../../styles/media'

/**
 * Immediate redirect to a dataset or snapshot route
 * @param {object} history react-router-dom history
 * @param {*} rootPath base path for relative redirects
 * @param {*} path target path for redirect
 */
const toolRedirect = (history, rootPath, path) => {
  history.push(`${rootPath}/${path}`)
}
/**
 * Toolbar parent component
 *
 * Dataset is the API object for the context (dataset or snapshot)
 */
const DatasetTools = ({ dataset, location, history }) => {
  const snapshot = snapshotVersion(location)
  const rootPath = snapshot
    ? `/datasets/${dataset.id}/versions/${snapshot}`
    : `/datasets/${dataset.id}`
  // TODO - disable if you lack write access to the draft
  const edit = snapshot ? false : true
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const [cookies] = useCookies()
  const user = getProfile(cookies)
  const hasEdit =
    (user && user.admin) ||
    hasEditPermissions(dataset.permissions, user && user.sub)
  const hasSnapshot = !!dataset.snapshots.length

  return (
    <>
      {showDeleteModal && (
        <Overlay className="delete-modal">
          <ModalContainer>
            <ExitButton onClick={() => setShowDeleteModal(false)}>
              &times;
            </ExitButton>
            <DeletePage
              dataset={dataset}
              returnToDataset={() => setShowDeleteModal(false)}
            />
          </ModalContainer>
        </Overlay>
      )}
      <div className="col-xs-12 dataset-tools-wrap">
        <div className="tools clearfix">
          <LoggedIn>
            <div role="presentation" className="tool">
              {!dataset.public && edit && hasSnapshot && (
                <WarnButton
                  tooltip="Publish Dataset"
                  icon="fa-globe icon-plus"
                  warn={false}
                  action={cb => {
                    toolRedirect(history, rootPath, 'publish')
                    cb()
                  }}
                />
              )}
            </div>
            {hasEdit && (
              <div role="presentation" className="tool">
                <span>
                  <button
                    className="btn-warn-component warning"
                    onClick={() => setShowDeleteModal(true)}>
                    <i className="fa fa-trash" />
                  </button>
                </span>
              </div>
            )}
            <div role="presentation" className="tool">
              {edit && (
                <WarnButton
                  tooltip="Manage Dataset Permissions"
                  icon="fa-user icon-plus"
                  warn={false}
                  action={cb => {
                    toolRedirect(history, rootPath, 'share')
                    cb()
                  }}
                />
              )}
            </div>
            <div role="presentation" className="tool">
              {edit && (
                <Media greaterThanOrEqual="medium">
                  <WarnButton
                    tooltip="Create Snapshot"
                    icon="fa-camera-retro icon-plus"
                    warn={false}
                    action={cb => {
                      toolRedirect(history, rootPath, 'snapshot')
                      cb()
                    }}
                  />
                </Media>
              )}
            </div>
            <div role="presentation" className="tool">
              <FollowDataset
                datasetId={dataset.id}
                following={dataset.following}
              />
            </div>
            <div role="presentation" className="tool">
              <StarDataset datasetId={dataset.id} starred={dataset.starred} />
            </div>
            <div role="presentation" className="tool">
              {edit && (
                <Media greaterThanOrEqual="medium">
                  <AdminUser>
                    <WarnButton
                      tooltip="Admin Datalad Tools"
                      icon="fa-magic"
                      warn={false}
                      action={cb => {
                        toolRedirect(history, rootPath, 'admin-datalad')
                        cb()
                      }}
                    />
                  </AdminUser>
                </Media>
              )}
            </div>
            <div role="presentation" className="tool">
              {edit && (
                <Media greaterThanOrEqual="medium">
                  <AdminUser>
                    <WarnButton
                      tooltip="Admin Remote Export Tools"
                      icon="fa-cloud-upload"
                      warn={false}
                      action={cb => {
                        toolRedirect(history, rootPath, 'admin-exports')
                        cb()
                      }}
                    />
                  </AdminUser>
                </Media>
              )}
            </div>
            <Media at="small">
              <div role="presentation" className="tool">
                <ShareDatasetLink url={`https://openneuro.org${rootPath}`} />
              </div>
            </Media>
          </LoggedIn>
          <div role="presentation" className="tool">
            <DatasetMetadata
              datasetId={dataset.id}
              metadata={dataset.metadata}
            />
          </div>
        </div>
      </div>
    </>
  )
}
DatasetTools.propTypes = {
  dataset: PropTypes.object,
  edit: PropTypes.bool,
  location: PropTypes.object,
  history: PropTypes.object,
}
export default withRouter(DatasetTools)
