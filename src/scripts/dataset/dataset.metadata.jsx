// dependencies -------------------------------------------------------

import React        from 'react';
import Reflux       from 'reflux';
import Actions      from './dataset.actions.js';
import ClickToEdit  from '../common/forms/click-to-edit.jsx';
import {Accordion, Panel} from 'react-bootstrap';
import FileTree     from './dataset.file-tree.jsx';
import Jobs         from './dataset.jobs.jsx';
import datasetStore from './dataset.store';

let Metadata = React.createClass({

    mixins: [Reflux.connect(datasetStore)],

// life cycle events --------------------------------------------------

	render() {
		let dataset     = this.props.dataset;
		let userOwns    = dataset ? dataset.userOwns : null;
		let canEdit     = userOwns && (dataset.access === 'rw' || dataset.access == 'admin');
		let description = dataset ? dataset.description : null;
		let README      = dataset ? dataset.README : null;
		let fsHeader 	= dataset.name + " File Structure";

		let metatdata = [
			{
				key:      'DatasetDOI',
				label:    'Dataset DOI',
				value:    description.DatasetDOI,
				onChange: this._updateDescription.bind(this, 'DatasetDOI'),
			},
			{
				key:      'License',
				label:    'License',
				value:    description.License,
				onChange: this._updateDescription.bind(this, 'License'),
			},
			{
				key:      'Authors',
				label:    'Authors',
				type:     'authors',
				value:    description.Authors,
				onChange: this._updateDescription.bind(this, 'Authors')
			},
			{
				key:      'Acknowledgements',
				label:    'Acknowledgements',
				value:    description.Acknowledgements,
				onChange: this._updateDescription.bind(this, 'Acknowledgements'),
			},
			{
				key:      'HowToAcknowledge',
				label:    'How to Acknowledge',
				value:    description.HowToAcknowledge,
				onChange: this._updateDescription.bind(this, 'HowToAcknowledge'),
			},
			{
				key:      'Funding',
				label:    'Funding',
				value:    description.Funding,
				onChange: this._updateDescription.bind(this, 'Funding'),
			},
			{
				key:      'ReferencesAndLinks',
				label:    'References and Links',
				value:    description.ReferencesAndLinks,
				onChange: this._updateDescription.bind(this, 'ReferencesAndLinks'),
			},
			{
				key:         'DigitalDocuments',
				label:       'Digital Documents',
				type:        'fileArray',
				value:       dataset.attachments,
				onChange:    this._uploadAttachment,
				onDelete:    this._deleteAttachment,
				onFileClick: this._downloadAttachment
			},
		];

		let items = metatdata.map((item) => {
			return (
				<div className="description-item" key={item.key}>
					<ClickToEdit
						value={item.value}
						label={item.label}
						type={item.type}
						editable={canEdit}
						onChange={item.onChange}
						onDelete={item.onDelete}
						onFileClick={item.onFileClick} />
				</div>
			);
		});
		let descriptors = (
			<div>
				<div className="dataset-readme col-xs-6">
					<ClickToEdit value={README}
						label="README"
						editable={canEdit}
						onChange={this._updateREADME} />
					<div className="fileStructure fadeIn panel-group">
						<div className="panel panel-default">
							<div className="panel-heading" >
								<h4 className="panel-title">
									{fsHeader}
								</h4>
							</div>
							<div className="panel-collapse" aria-expanded="false" >
								<div className="panel-body">
									<FileTree tree={[dataset]} editable={canEdit}/>
								</div>
							</div>
						</div>
					</div>

					<div className="fileStructure fadeIn panel-group">
						<div className="panel panel-default">
							<div className="panel-heading" >
								<h4 className="panel-title">
									Dataset Analysis
								</h4>
							</div>
							<div className="panel-collapse" aria-expanded="false" >
								<div className="panel-body">
									<Jobs jobs={this.state.jobs}/>
								</div>
							</div>
						</div>
					</div>

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

	_updateAuthors: Actions.updateAuthors,

	_uploadAttachment: Actions.uploadAttachment,

	_deleteAttachment: Actions.deleteAttachment,

	_downloadAttachment: Actions.downloadAttachment,

	_updateREADME: Actions.updateREADME

});

export default Metadata;