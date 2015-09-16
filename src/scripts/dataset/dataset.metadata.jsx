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
		let README      = dataset ? dataset.README : null;
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
						editable={userOwns}
						onChange={this._updateREADME} />
					<Accordion className="fileStructure fadeIn">
						<Panel header={fsHeader} eventKey='1'>
					  		<FileTree tree={[dataset]} />
					  	</Panel>
			  		</Accordion>
				</div>
				<div className="dataset-descriptions col-xs-6">
					{items}
					<div className="description-item">
						<ClickToEdit value={dataset.attachments}
							label="Digital Documents"
							editable={userOwns}
							onChange={this._uploadAttachment}
							onDelete={this._deleteAttachment}
							onFileClick={this._downloadAttachment}
							type="fileArray" />
					</div>
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

	_uploadAttachment: Actions.uploadAttachment,

	_updateREADME: Actions.updateREADME,

	_deleteAttachment: Actions.deleteAttachment,

	_downloadAttachment: Actions.downloadAttachment

});

export default Metadata;