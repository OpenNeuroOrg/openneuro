// dependencies -------------------------------------------------------

import React        from 'react';

let Statuses = React.createClass({

// life cycle events --------------------------------------------------

	render() {

		let dataset = this.props.dataset;

		return (
			<ul className="nav nav-pills">
				<li>
					<span className="dataset-status ds-info">
						{dataset && dataset.status && dataset.public ? <span><i className="fa fa-eye"></i>public</span> : null}
					</span>
				</li>
				<li>
					<span className="dataset-status ds-warning">
						{dataset && dataset.status && dataset.status.uploadIncomplete ? <span><i className="fa fa-warning"></i>incomplete</span> : null}
					</span>
				</li>
			</ul>
    	);
	},

// custon methods -----------------------------------------------------

});

export default Statuses;