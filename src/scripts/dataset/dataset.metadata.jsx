// dependencies -------------------------------------------------------

import React        from 'react';
import Actions      from './dataset.actions.js';
import ClickToEdit  from '../common/forms/click-to-edit.jsx';

let Metadata = React.createClass({

// life cycle events --------------------------------------------------

	render() {
		let dataset     = this.props.dataset;
		let userOwns    = dataset ? dataset.userOwns : null;
		let description = dataset ? dataset.description : null;
		let README = "README file is plain text and can follow any format you would like";
		
		let items = [];
		for (let key in description) {
			items.push(
				<ClickToEdit value={description[key]}
					key={key}
					label={key}
					editable={userOwns}
					onChange={this._updateDescription.bind(this, key)} />
			);
		}

		let descriptors = (
			<div>
				{items}
			</div>
		);

		return (
			<div className="well">{descriptors}</div>
    	);
	},

// custon methods -----------------------------------------------------

	_updateDescription: Actions.updateDescription,

});

export default Metadata;