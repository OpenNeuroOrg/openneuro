// dependencies -------------------------------------------------------

import React      from 'react'
import LeftNavbar from '../common/partials/leftNavbar.component.jsx';

class Dashboard extends React.Component {

// life cycle events --------------------------------------------------

	render () {
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
	
	}

// custom methods -----------------------------------------------------

}

export default Dashboard;





