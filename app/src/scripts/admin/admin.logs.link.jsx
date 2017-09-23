import React from 'react'
import { Link } from 'react-router'

const LogLink = ({ log }) => {
  if ('job' in log.data) {
    // Jobs are always run against snapshots, so we link to a snapshot + job ref for those
    const job = log.data.job
    return (
      <Link
        to={'snapshot'}
        params={{ datasetId: job.datasetId, snapshotId: job.snapshotId }}
        query={{
          app: job.appLabel,
          version: job.appVersion,
          job: job.jobId,
        }}>
        {job.datasetLabel} <br /> {job.appLabel}:{job.appVersion}
      </Link>
    )
  } else if ('dataset' in log.data) {
    const dataset = log.data.dataset
    return (
      <Link to={'dataset'} params={{ datasetId: dataset.datasetId }}>
        {dataset.datasetLabel}
      </Link>
    )
  } else {
    // No linkable objects
    return <span />
  }
}

LogLink.propTypes = {
  log: React.PropTypes.object,
}

export default LogLink
