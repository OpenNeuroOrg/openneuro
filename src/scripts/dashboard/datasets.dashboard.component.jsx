// dependencies -------------------------------------------------------

import React               from 'react'
import {PanelGroup, Panel} from 'react-bootstrap';

class Datasets extends React.Component {

// life cycle events --------------------------------------------------
	
	render () {
		let datasetheader =(
			<div className="header clearfix">
				<h4 className="dataset">fake header text</h4>
				<div className="date">6/10/15 <span className="time-passed">now</span></div>
			</div>
		);

		return (
			<div className="dash-tab-content datasets fadeIn">
				<h2>My Datasets</h2>
				<PanelGroup accordion>
					<Panel header={datasetheader} eventKey='1'>
						<div className="inner">
							Panel 1 content<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
						</div>
					</Panel>
					<Panel header={datasetheader} eventKey='2'>
						<div className="inner">
							Panel 2 content<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
						</div>
					</Panel>
				</PanelGroup>
			</div>
    	);
	}

// custom methods -----------------------------------------------------
}

export default Datasets;





