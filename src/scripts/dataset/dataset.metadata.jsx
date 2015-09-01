// dependencies -------------------------------------------------------

import React        from 'react';
import Reflux       from 'reflux';
import datasetStore from './dataset.store';
import Actions      from './dataset.actions.js';
import ClickToEdit  from '../common/forms/click-to-edit.jsx';

let Metadata = React.createClass({

    mixins: [Reflux.connect(datasetStore)],

// life cycle events --------------------------------------------------

	render() {

		let userOwns   = this.state.userOwns;

		let description = this.state.description;

		let README = "README file is plain text and can follow any format you would like";

		let items = [];
		for (let key in this.state.description) {
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
				<ClickToEdit value={README} editable={userOwns} />
				<button onClick={function() {console.log(description)}}>testdatachanges</button>
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