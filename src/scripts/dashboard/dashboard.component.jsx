// dependencies -------------------------------------------------------

import React     from 'react'
import Upload from '../upload/upload.component.jsx';
import LeftNavbar from '../common/partials/leftNavbar.component.jsx';
import { Alert, Accordion, Panel, ProgressBar } from 'react-bootstrap';

let Dashboard = React.createClass({

// life cycle events --------------------------------------------------
	render: function () {
		// Alert bsStyle: danger, warning, success, info
		return (
			<div className="view container">
				<div className="col-xs-1 left-nav">
					<LeftNavbar />
				</div>
				<div className="col-xs-11">
					Dash
				</div>
			</div>
    	);
	
	},



// custom methods -----------------------------------------------------

});

export default Dashboard;





