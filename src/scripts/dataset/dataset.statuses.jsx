// dependencies -------------------------------------------------------

import React        from 'react';
import Reflux       from 'reflux';
import datasetStore from './dataset.store';

let Statuses = React.createClass({

    mixins: [Reflux.connect(datasetStore)],

// life cycle events --------------------------------------------------

	render() {
		let dataset = this.state.dataset;
		return (
			<div className="well">
				{dataset && dataset[0].status && dataset[0].status.uploadIncomplete ? <span>incomplete <i className="fa fa-warning"></i></span> : null}
			</div>
    	);
	},

// custon methods -----------------------------------------------------

});

export default Statuses;