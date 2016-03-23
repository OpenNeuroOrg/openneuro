// dependencies -------------------------------------------------------

import React   from 'react';
import Reflux  from 'reflux';
import Status  from '../common/partials/status.jsx';
import UploadStore   from '../upload/upload.store.js';

let Statuses = React.createClass({

	mixins: [Reflux.connect(UploadStore)],

// life cycle events --------------------------------------------------

	getDefaultProps() {
	    return {
	        minimal: false
	    };
	},

	render() {
		let dataset = this.props.dataset;
		let uploading = dataset._id === this.state.projectId;

		let publicStatus     = <Status type='public' minimal={this.props.minimal} />;
		let incompleteStatus = <Status type='incomplete' dataset={dataset} minimal={this.props.minimal} />;
		let sharedWithStatus = <Status type='shared' minimal={this.props.minimal} />;
		let inProgress       = <Status type='inProgress' minimal={this.props.minimal} />;
		let invalid          = <Status type='invalid' minimal={this.props.minimal} />;

		return (
			<span className="clearfix status-wrap">
				{dataset.public ? publicStatus : null}
				{dataset.status.uploadIncomplete && !uploading ? incompleteStatus : null}
				{dataset.status.shared ? sharedWithStatus : null}
				{uploading ? inProgress : null}
				{dataset.status.invalid ? invalid : null}
			</span>
    	);
	},

// custom methods -----------------------------------------------------

});

export default Statuses;