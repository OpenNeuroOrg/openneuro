// dependencies -------------------------------------------------------

import React   from 'react';
import Tooltip from '../common/partials/tooltip.component.jsx'

let Statuses = React.createClass({

// life cycle events --------------------------------------------------

	render() {

		let dataset = this.props.dataset;
		let publicStatus = (
			<li>
				<span className="dataset-status ds-info">
					<Tooltip tooltip='public' ><i className="fa fa-eye"></i></Tooltip>
				</span>
			</li>
		);
		let incompleteStatus =  (				
			<li>
				<span className="dataset-status ds-warning">
					<Tooltip tooltip='incomplete' ><i className="fa fa-warning"></i></Tooltip>
				</span>
			</li>
		);
		let sharedWithStatus = (				
			<li>
				<span className="dataset-status ds-info">
					<Tooltip tooltip='shared with me' ><i className="fa fa-user"></i></Tooltip>
				</span>
			</li>
		);
		return (
			<ul className="nav nav-pills">

						{dataset && dataset.status && dataset.public ? publicStatus : null}
						{dataset && dataset.status && dataset.status.uploadIncomplete ? incompleteStatus: null}
						{dataset && dataset.userOwns && !dataset.userCreated ? sharedWithStatus: null}
				
			</ul>
    	);
	},

// custon methods -----------------------------------------------------

});

export default Statuses;