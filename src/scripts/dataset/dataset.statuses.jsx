// dependencies -------------------------------------------------------

import React        from 'react';

let Statuses = React.createClass({

// life cycle events --------------------------------------------------

	render() {
		let dataset = this.props.dataset;
		return (
			<div className="well">
				{dataset && dataset.status && dataset.status.uploadIncomplete ? <span>incomplete <i className="fa fa-warning"></i></span> : null}
			</div>
    	);
	},

// custon methods -----------------------------------------------------

});

export default Statuses;