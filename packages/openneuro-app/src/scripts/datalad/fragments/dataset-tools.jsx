import React from 'react'
import PropTypes from 'prop-types'
import snapshotVersion from '../snapshotVersion.js'
import DownloadButton from './tools/download-button.jsx'
import * as actions from './dataset-tools-actions.js'

/**
 * tooltip: text for tooltip
 * icon: fa-icon for this button
 * action: the action function associated with this
 * write: is this a mutation?
 */
const toolConfig = [
  {
    tooltip: 'Download Dataset',
    icon: 'fa-download',
    action: actions.download,
    write: false,
  },
  {
    tooltip: 'Publish Dataset',
    icon: 'fa-globe icon-plus',
    action: actions.publish,
    write: true,
  },
  {
    tooltip: 'Delete Dataset',
    icon: 'fa-trash',
    action: actions.del,
    write: true,
  },
  {
    tooltip: 'Share Dataset',
    icon: 'fa-user icon-plus',
    action: actions.share,
    write: false,
  },
  {
    tooltip: 'Create Snapshot',
    icon: 'fa-camera-retro icon-plus',
    action: actions.snapshot,
    write: true,
  },
  {
    tooptip: 'Follow Dataset',
    icon: 'fa-tag icon-plus',
    action: actions.follow,
    write: false,
  },
  {
    tooptip: 'Star Dataset',
    icon: 'fa-star icon-plus',
    action: actions.star,
    write: false,
  },
]

const toolRedirect = (history, rootPath, path) => {
  history.push(`${rootPath}/${path}`)
}

const DatasetTools = ({ dataset, edit, location, history }) => {
  const snapshot = snapshotVersion(location)
  const rootPath = snapshot
    ? `/datasets/${dataset.id}/versions/${snapshot}`
    : `/datasets/${dataset.id}`
  return (
    <div className="col-xs-12 dataset-tools-wrap">
      <div className="tools clearfix">
        <div role="presentation" className="tool">
          <DownloadButton
            action={cb => {
              toolRedirect(history, rootPath, 'download')
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
