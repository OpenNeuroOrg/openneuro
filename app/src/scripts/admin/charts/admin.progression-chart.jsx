// dependencies ----------------------------------------------------------------------

import React 				from 'react'
import ReactDOM 			from 'react-dom'
import { VictoryScatter } 	from 'victory'
import { Link } 			from 'react-router'


// // Life Cycle ----------------------------------------------------------------------

const Chart = ({ log }) => {

	console.log(log);
	 // if ('job' in log.data && 'datasetId' in log.data.job) {
    // Jobs are always run against snapshots, so we link to a snapshot + job ref for those
    // const job = log.data.job
    console.log(log.data.job);
    // return (
    //   <Link
    //     to={'snapshot'}
    //     params={{ datasetId: job.datasetId, snapshotId: job.snapshotId }}
    //     query={{
    //       app: job.appLabel,
    //       version: job.appVersion,
    //       job: job.jobId,
    //     }}>
    //     {job.datasetLabel} <br /> {job.appLabel}:{job.appVersion}
    //   </Link>
    // )
  // } else if ('dataset' in log.data) {
    // const dataset = log.data.dataset
    // return (
    //   <Link to={'dataset'} params={{ datasetId: dataset.datasetId }}>
    //     {dataset.datasetLabel}
    //   </Link>
    // )
  // } else {
    // // No linkable objects
    // return <span />
  // }


// LogLink.propTypes = {
//   log: React.PropTypes.object,
// }

		return (
			<div>
				<h2>This is the chart currently loading:</h2>
				<VictoryScatter
				  style={{
				    parent: {
				      border: "1px solid #ccc"
				    },
				    data: {
				      fill: "#c43a31", fillOpacity: 0.6, stroke: "#c43a31", strokeWidth: 3
				    },
				    labels: {
				      fontSize: 15, fill: "#c43a31", padding: 15
				    }
				  }}
				  size={9}
				  data={[
				  			{x : 'Successfull', y : 45},
				  			{x : 'Failed', y : 45},
				  			{x : 'Unknown', y : 10},
				  	]}
				  labels={(datum) => datum.x}
				/>
			</div>
		)

};

export default Chart;

// module.exports = ReactDOM.render("whaaaasup");