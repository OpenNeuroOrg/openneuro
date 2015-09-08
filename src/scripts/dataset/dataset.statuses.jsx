// dependencies -------------------------------------------------------

import React        from 'react';
import TooltipTop   from '../common/partials/tooltip.component.jsx'

let Statuses = React.createClass({

// life cycle events --------------------------------------------------

	render() {

		let dataset = this.props.dataset;
		let publicStatus = <TooltipTop tooltip='public' ><i className="fa fa-eye"></i></TooltipTop>;
		let incompleteStatus = <TooltipTop tooltip='incomplete' ><i className="fa fa-warning"></i></TooltipTop> 
		return (
			<ul className="nav nav-pills">
				<li>
					<span className="dataset-status ds-info">
						{dataset && dataset.status && dataset.public ? {publicStatus} : null}
					</span>
				</li>
				<li>
					<span className="dataset-status ds-warning">
						{dataset && dataset.status && dataset.status.uploadIncomplete ? {incompleteStatus}: null}
					</span>
				</li>
			</ul>
    	);
	},

// custon methods -----------------------------------------------------

});

export default Statuses;