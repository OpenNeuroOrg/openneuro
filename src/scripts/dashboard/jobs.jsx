// dependencies -------------------------------------------------------

import React               from 'react'
import {PanelGroup} from 'react-bootstrap';
import {Link}               from 'react-router';

class Jobs extends React.Component {

// life cycle events --------------------------------------------------

	render () {
		return (
			<div className="dash-tab-content jobs fadeIn">
				<h2>My Jobs Results</h2>
				<PanelGroup>
                    <div className="fadeIn  panel panel-default">
                        <div className="panel-heading">
		                    <div className="header clearfix">
		                        <Link to="jobs">
		                            <h4 className="dataset">
		                                dataset name
		                                <span className="status">status</span>
		                            </h4>
		                            <div className="date">dateadded<span className="time-ago">timeago</span></div>
		                        </Link>
		                    </div>
                        </div>
                    </div>
				</PanelGroup>
			</div>
    	);
	}

// custom methods -----------------------------------------------------
}

export default Jobs;





