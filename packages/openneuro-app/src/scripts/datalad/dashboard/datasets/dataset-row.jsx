import React from 'react'
import PropTypes from 'prop-types'
import Statuses from './dataset-statuses.jsx'
import Metrics from '../../../dataset/dataset.metrics.jsx'
import Uploaded from './uploaded.jsx'
import Summary from '../../fragments/dataset-summary.jsx'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'

const RowHeight = styled.div`
  height: 93px;
`

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
            <Link to={'/datasets/' + dataset.id}>
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
}

export default DatasetRow
