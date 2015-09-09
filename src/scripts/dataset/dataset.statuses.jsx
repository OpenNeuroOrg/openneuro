// dependencies -------------------------------------------------------

import React   from 'react';
import Status  from '../common/partials/status.jsx';

let Statuses = React.createClass({

// life cycle events --------------------------------------------------

	render() {

		let dataset = this.props.dataset;
		let publicStatus     = <li><Status type='public' /></li>;
		let incompleteStatus = <li><Status type='incomplete' /></li>;
		let sharedWithStatus = <li><Status type='shared' /></li>;
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