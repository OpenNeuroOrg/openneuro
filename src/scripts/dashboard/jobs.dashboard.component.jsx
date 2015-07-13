// dependencies -------------------------------------------------------

import React      from 'react'
import {PanelGroup, Panel} from 'react-bootstrap';

class Jobs extends React.Component {

// life cycle events --------------------------------------------------
	render () {
		// Alert bsStyle: danger, warning, success, info

		return (
			
			<div className="dash-tab-content notifications fadeIn">
				<h2>My Jobs Results</h2>
				<PanelGroup accordion>
					<Panel header='job' eventKey='1'>
						<div className="inner">
							Panel 1 content<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
						</div>
					</Panel>
					<Panel header='job two' eventKey='2'>
						<div className="inner">
							Panel 2 content<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
						</div>
					</Panel>
				</PanelGroup>
			</div>
		
    	);
	
	};

// custom methods -----------------------------------------------------
}

export default Jobs;





