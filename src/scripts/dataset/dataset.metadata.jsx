// dependencies -------------------------------------------------------

import React        from 'react';
import Actions      from './dataset.actions.js';
import ClickToEdit  from '../common/forms/click-to-edit.jsx';
import {Accordion, Panel} from 'react-bootstrap';
import FileTree     from '../upload/upload.file-tree.jsx';

let Metadata = React.createClass({

// life cycle events --------------------------------------------------

	render() {
		let dataset     = this.props.dataset;
		let userOwns    = dataset ? dataset.userOwns : null;
		let description = dataset ? dataset.description : null;
		let README      = "";
		let fsHeader 	= dataset.name + " File Structure";

		
		let items = [];
		for (let key in description) {
			items.push(
				<div className="description-item" key={key}>
					<ClickToEdit value={description[key]}
						label={key}
						editable={userOwns}
						onChange={this._updateDescription.bind(this, key)} />
					</div>
			);
		}

		let descriptors = (
			<div>
				<div className="dataset-readme col-xs-6">
					<ClickToEdit value={README}
						label="README"
						editable={userOwns} />
					<Accordion className="fileStructure fadeIn">
						<Panel header={fsHeader} eventKey='1'>
					  		<FileTree tree={[dataset]} />
					  	</Panel>
			  		</Accordion>
				</div>
				<div className="dataset-descriptions col-xs-6">
					{items}
				</div>
				
			</div>
		);

		return (
			<div>
				
				{descriptors}
			</div>
    	);
	},

// custon methods -----------------------------------------------------

	_updateDescription: Actions.updateDescription,

});

export default Metadata;