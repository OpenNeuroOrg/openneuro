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

		let publicStatus     = <span className="clearfix status"><Status type='public' /></span>;
		let incompleteStatus = <span className="clearfix status"><Status type='incomplete' dataset={dataset} /></span>;
		let sharedWithStatus = <span className="clearfix status"><Status type='shared' /></span>;
		let inProgress       = <span className="clearfix status"><Status type='inProgress' /></span>;
		return (
			<span className="clearfix status-wrap">
				{dataset && dataset.status && dataset.public ? publicStatus : null}
				{dataset && dataset.status && dataset.status.uploadIncomplete && !uploading ? incompleteStatus: null}
				{dataset && dataset.userOwns && !dataset.userCreated ? sharedWithStatus: null}
				{dataset && uploading ? inProgress : null}
			</span>
    	);
	},

// custon methods -----------------------------------------------------

});

export default Statuses;