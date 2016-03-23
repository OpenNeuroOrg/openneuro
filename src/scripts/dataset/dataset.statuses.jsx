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

		return (
			<span className="clearfix status-wrap">
				<Status type='public' minimal={this.props.minimal} display={dataset.public} />
				<Status type='incomplete' dataset={dataset} minimal={this.props.minimal} display={dataset.status.uploadIncomplete && !uploading} />
				<Status type='shared' minimal={this.props.minimal} display={dataset.status.shared} />
				<Status type='inProgress' minimal={this.props.minimal} display={uploading} />
				<Status type='invalid' minimal={this.props.minimal} display={dataset.status.invalid} />
			</span>
    	);
	}

});

export default Statuses;