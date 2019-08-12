import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import snapshotVersion from '../snapshotVersion.js'
import WarnButton from '../../common/forms/warn-button.jsx'
import DeleteDataset from '../mutations/delete.jsx'
import FollowDataset from '../mutations/follow.jsx'
import StarDataset from '../mutations/star.jsx'
import DatasetMetadata from './metadata-tool.jsx'
import LoggedIn from '../../authentication/logged-in.jsx'

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
  return (
    <div className="col-xs-12 dataset-tools-wrap">
      <div className="tools clearfix">
        <LoggedIn>
          <div role="presentation" className="tool">
            {!dataset.public &&
              edit && (
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
          <div role="presentation" className="tool">
            {edit && <DeleteDataset datasetId={dataset.id} />}
          </div>
          <div role="presentation" className="tool">
            {edit && (
              <WarnButton
                tooltip="Share Dataset"
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
              <WarnButton
                tooltip="Create Snapshot"
                icon="fa-camera-retro icon-plus"
                warn={false}
                action={cb => {
                  toolRedirect(history, rootPath, 'snapshot')
                  cb()
                }}
              />
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
            <DatasetMetadata datasetId={dataset.id} metadata={dataset.metadata} />
          </div>
        </LoggedIn>
      </div>
    </div>
  )
}

DatasetTools.propTypes = {
  dataset: PropTypes.object,
  edit: PropTypes.bool,
  location: PropTypes.object,
  history: PropTypes.object,
}

export default withRouter(DatasetTools)
