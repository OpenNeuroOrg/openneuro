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

		let publicStatus      = <Status type='public' />;
		let incompleteStatus  = <Status type='incomplete' dataset={dataset} />;
		let sharedWithStatus  = <Status type='shared' />;
		let inProgress        = <Status type='inProgress' />;
		let pendingValidation = <Status type='pendingValidation' />;

		return (
			<span className="clearfix status-wrap">
				{dataset && dataset.status && dataset.public ? publicStatus : null}
				{dataset && dataset.status && dataset.status.uploadIncomplete && !uploading ? incompleteStatus: null}
				{dataset && dataset.access && !dataset.userCreated ? sharedWithStatus: null}
				{dataset && uploading ? inProgress : null}
				{dataset && dataset.status && dataset.status.pendingValidation ? pendingValidation : null}
			</span>
    	);
	},

// custom methods -----------------------------------------------------

});

export default Statuses;