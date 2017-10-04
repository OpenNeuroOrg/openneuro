import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const LogLink = ({ log }) => {
  // datasetId check is for bugged logs from #102
  if ('job' in log.data && 'datasetId' in log.data.job) {
    // Jobs are always run against snapshots, so we link to a snapshot + job ref for those
    const job = log.data.job
    return (
      <Link to={'/datasets/' + job.datasetId + '/versions/' + job.snapshotId}>
        {job.datasetLabel} <br /> {job.appLabel}:{job.appVersion}
      </Link>
    )
  } else if ('dataset' in log.data) {
    const dataset = log.data.dataset
    return (
      <Link to={'/datasets/' + dataset.datasetId}>{dataset.datasetLabel}</Link>
    )
  } else {
    // No linkable objects
    return <span />
  }
}

LogLink.propTypes = {
  log: PropTypes.object,
}

export default LogLink
