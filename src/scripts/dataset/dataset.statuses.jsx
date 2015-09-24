// dependencies -------------------------------------------------------

import React   from 'react';
import Reflux  from 'reflux';
import Status  from '../common/partials/status.jsx';
import UploadStore   from '../upload/upload.store.js';

let Statuses = React.createClass({

	mixins: [Reflux.connect(UploadStore)],

// life cycle events --------------------------------------------------

	render() {
		let dataset = this.props.dataset;
		let uploading = dataset._id === this.state.projectId;

		let publicStatus     = <li><Status type='public' /></li>;
		let incompleteStatus = <li><Status type='incomplete' /></li>;
		let sharedWithStatus = <li><Status type='shared' /></li>;
		let inProgress       = <li><Status type='inProgress' /></li>;
		return (
			<ul className="nav nav-pills">
				{dataset && dataset.status && dataset.public ? publicStatus : null}
				{dataset && dataset.status && dataset.status.uploadIncomplete && !uploading ? incompleteStatus: null}
				{dataset && dataset.userOwns && !dataset.userCreated ? sharedWithStatus: null}
				{dataset && uploading ? inProgress : null}
			</ul>
    	);
	},

// custon methods -----------------------------------------------------

});

export default Statuses;