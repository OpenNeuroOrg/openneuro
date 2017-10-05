// dependencies ----------------------------------------------------------------------

import React 			from 'react'
import Reflux 			from 'reflux'
import Actions 			from './admin.actions.js'
import adminStore 		from './admin.store'
import {Link}			from 'react-router'
import {Route}			from 'react-router'

// import Chart 			from './charts/admin.progression-chart.jsx'
// import LoadingChart		from 'bundle-loader!./charts/admin.progression-chart.jsx'
import { VictoryPie} 	from 'victory'


let Progresssion = React.createClass({
  	mixins: [Reflux.connect(adminStore)],
	
	getInitialState() {
		let initialState = {
			"chart" : "whaddup",
			"count" : 0,
			"failedLogs": [],
		}
		return initialState;
	},

// // Lazy Loading ----------------------------------------------------------------------
// 	componentDidMount() {
// 		const load = require("bundle-loader!./charts/admin.progression-chart.jsx")(function(file) {
// 			// console.log(typeof(file));
// 			// this.setState({"chart": "fudge"});
// 			return file;
// 		});
// 		// console.log(load);
// 	},
	

// Life Cycle ----------------------------------------------------------------------

	render() {

		return (
			<div className="dashboard-dataset-teasers fade-in">
				<div className="header-wrap clearfix">
					<div className="col-sm-9">
						<h1 className="testing123">Lazy loading: {this.state.chart} whaaaa</h1>
					</div>
				</div>
			</div>
		)
	},

	chartItUp() {
		let eventLogs = this.state.eventLogs;
		let logs = [];
		// let failedLogs = [];
		let uploadingLogs = [];

    	Object.keys(eventLogs).map((key) => {
			let job = eventLogs[key];
			// console.log(job);
			let status = job.data.job.status;
			if (status != undefined || status != null) {
				if (status === "FAILED") {
					this.state.failedLogs.push(job._id);
				} else {
					uploadingLogs.push(job._id);
				}
				console.log(this.state.failedLogs);
			}
    	});
			// logs.push(data);	
			
		let data = [
			{x : "failures", y : 19},
			{x : "uploading",  y : 21}
		]

    	return (
    		<div>
				<h2>This is the chart currently loading:</h2>
				<VictoryPie 
				data = {data}
				/>
			</div>
    		)
	}

});

// Progresssion.proptypes =  {
// 	jobName: React.proptypes.string,
// 	jobId: React.proptypes.string,
// 	status: React.proptypes.string,
// 	link: React.proptypes.func,
// }


export default Progresssion;