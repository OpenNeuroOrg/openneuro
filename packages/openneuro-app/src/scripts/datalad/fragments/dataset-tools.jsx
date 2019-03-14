import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import snapshotVersion from '../snapshotVersion.js'
import WarnButton from '../../common/forms/warn-button.jsx'

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
        <div role="presentation" className="tool">
          <WarnButton
            tooltip="Download Dataset"
            icon="fa-download"
            warn={false}
            action={cb => {
              toolRedirect(history, rootPath, 'download')
              cb()
            }}
          />
        </div>
        <div role="presentation" className="tool">
          {edit && (
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
          {edit && (
            <WarnButton
              tooltip="Delete Dataset"
              icon="fa-trash"
              warn={true}
              action={cb => {
                console.log('Delete dataset')
                cb()
              }}
            />
          )}
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
          <WarnButton
            tooltip="Follow Dataset"
            icon="fa-tag icon-plus"
            warn={false}
            action={cb => {
              console.log('Follow dataset')
              cb()
            }}
          />
        </div>
        <div role="presentation" className="tool">
          <WarnButton
            tooltip="Star Dataset"
            icon="fa-star icon-plus"
            warn={false}
            action={cb => {
              console.log('Star dataset')
              cb()
            }}
          />
        </div>
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
