// dependencies -------------------------------------------------------

import React               	from 'react';
import moment              	from 'moment';
import {PanelGroup, Panel}	from 'react-bootstrap';
import scitran             	from '../utils/scitran';
	
class Datasets extends React.Component {
		
	constructor () {
		super();
		this.state = {
			loading: false,
			datasets: []
		};
		
	}


// life cycle events --------------------------------------------------
	
	componentDidMount() {
		let self = this;
		self.setState({loading: true})
		scitran.getProjects(function (datasets) {
			self.setState({datasets: datasets, loading: false});
		});
	}

	render() {
		let self = this;
		let datasets = this.state.datasets.map(function (dataset, index) {
			let dateAdded = moment(dataset.timestamp).format('L');
			let timeago = moment(dataset.timestamp).fromNow(true)
			let datasetheader =(
				<div className="header clearfix">
					<h4 className="dataset">{dataset.name}</h4>
					<div className="date">{dateAdded}<span className="time-ago">{timeago}</span></div>
				</div>
			);
			return (
				<Panel className="fadeIn" header={datasetheader} eventKey={index} key={index}>
					<div className="inner">
						<button onClick={self.deleteProject.bind(self, dataset)}>Delete</button>
						test
					</div>
				</Panel>
			);
		});

		let spinner = (
			<div className="loading-wrap fadeIn">
				<div className="spinner">
					<div className="spinnerinner"></div>
				</div>
				<span>Loading</span>
			</div>
		);

		return (
			<div className="dash-tab-content datasets fadeIn">
				<h2>My Datasets</h2>
    			<PanelGroup accordion>
					{this.state.loading ? spinner : datasets}
				</PanelGroup>
			</div>
    	);
	}

// custom methods -----------------------------------------------------

	deleteProject(dataset) {
		let self = this;

		
		scitran.deleteDataset(dataset._id, function () {
			// update state
			for (var i = 0; i < self.state.datasets.length; i++) {
				if (dataset._id === self.state.datasets[i]._id) {
					let datasets = self.state.datasets;
					datasets.splice(i, 1);
					self.setState({datasets: datasets});
				}
			}
		});
	}

};

export default Datasets;





