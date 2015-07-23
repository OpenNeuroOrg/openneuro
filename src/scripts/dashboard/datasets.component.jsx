// dependencies -------------------------------------------------------

import React               from 'react';
import {PanelGroup, Panel} from 'react-bootstrap';
import scitran             from '../utils/scitran';

class Datasets extends React.Component {

	constructor () {
		super();
		this.state = {
			loading: false,
			datasets: []
		};
	}

// life cycle events --------------------------------------------------
	
	componentDidMount () {
		let self = this;
		self.setState({loading: true})
		scitran.getProjects(function (datasets) {
			self.setState({datasets: datasets, loading: false});
		});
	}

	render () {
		
		let datasets = this.state.datasets.map(function (dataset, index) {
			let datasetheader =(
				<div className="header clearfix">
					<h4 className="dataset">{dataset.name}</h4>
					<div className="date">{dataset.timestamp}<span className="time-passed">now</span></div>
				</div>
			);
			return (
				<Panel className="fadeIn" header={datasetheader} eventKey={index} key={index}>
					<div className="inner">
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

}

export default Datasets;





