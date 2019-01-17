import React from 'react'
import PropTypes from 'prop-types'
import Statuses from './dataset-statuses.jsx'
import Metrics from '../../../dataset/dataset.metrics.jsx'
import Uploaded from './uploaded.jsx'
import Summary from '../../fragments/dataset-summary.jsx'
import { Link } from 'react-router-dom'
import RowHeight from './row-height.jsx'

export const genLinkTarget = (dataset, publicDashboard) => {
  let linkTarget = '/datasets/' + dataset.id
  if (dataset.snapshots.length > 0 && publicDashboard) {
    const sortedSnapshots = [...dataset.snapshots].sort((a, b) => {
      return new Date(b.created) - new Date(a.created)
    })
    const newestSnapshot = sortedSnapshots[0]
    return `${linkTarget}/versions/${newestSnapshot.tag}`
  } else {
    return linkTarget
  }
}

class DatasetRow extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.dataset.id !== nextProps.dataset.id
  }
  render() {
    const dataset = this.props.dataset
    return (
      <div className="panel panel-default">
        <RowHeight className="panel-heading">
          <div className="header clearfix">
            <Link to={genLinkTarget(dataset, this.props.publicDashboard)}>
              <h4 className="dataset-name">{dataset.draft.description.Name}</h4>
              <Uploaded uploader={dataset.uploader} created={dataset.created} />
            </Link>
            <div className="metric-container">
              <Metrics dataset={dataset} fromDashboard />
            </div>
            <div className="status-container">
              <Statuses dataset={dataset} minimal={true} />
            </div>
          </div>
          <Summary summary={dataset.draft.summary} minimal={true} />
        </RowHeight>
      </div>
    )
  }
}

DatasetRow.propTypes = {
  dataset: PropTypes.object,
  publicDashboard: PropTypes.bool,
}

export default DatasetRow
