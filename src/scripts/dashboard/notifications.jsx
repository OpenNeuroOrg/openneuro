// dependencies -------------------------------------------------------

import React               from 'react'
import {PanelGroup, Panel} from 'react-bootstrap';
import {Link}               from 'react-router';

class Notifications extends React.Component {

// life cycle events --------------------------------------------------

	render () {
		let notificatonheader =(
			<div className="header clearfix unread">
				<h4 className="dataset">fake header text</h4>
				<div className="date">6/10/15 <span className="time-passed">now</span></div>
			</div>
		);

		return (
			<div className="dash-tab-content datasets fadeIn">
				<h2>My Notifications</h2>
				<PanelGroup>
                    <div className="fadeIn  panel panel-default">
                        <div className="panel-heading">
		                    <div className="header clearfix">
		                        <Link to="notifications">
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

export default Notifications;





