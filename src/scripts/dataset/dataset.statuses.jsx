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

		let publicStatus     = <li className="clearfix"><Status type='public' /></li>;
		let incompleteStatus = <li className="clearfix"><Status type='incomplete' dataset={dataset} /></li>;
		let sharedWithStatus = <li className="clearfix"><Status type='shared' /></li>;
		let inProgress       = <li className="clearfix"><Status type='inProgress' /></li>;
		return (
			<ul className="clearfix">
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