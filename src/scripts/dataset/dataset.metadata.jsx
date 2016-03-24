// dependencies -------------------------------------------------------

import React        from 'react';
import Reflux       from 'reflux';
import actions      from './dataset.actions.js';
import ClickToEdit  from '../common/forms/click-to-edit.jsx';
import datasetStore from './dataset.store';

let MetaData = React.createClass({

    mixins: [Reflux.connect(datasetStore)],

// life cycle events --------------------------------------------------

	render() {
		let dataset     = this.props.dataset;
		let description = dataset.description;

		let metadata = [
			{
				key:      'Authors',
				label:    'Authors',
				type:     'authors',
				value:    description.Authors,
				onChange: actions.updateDescription.bind(this, 'Authors')
			},
			{
				key:      'README',
				label:    'README',
				value:    dataset.README,
				onChange: actions.updateREADME
			},
			{
				key:      'DatasetDOI',
				label:    'Dataset DOI',
				value:    description.DatasetDOI,
				onChange: actions.updateDescription.bind(this, 'DatasetDOI'),
			},
			{
				key:      'License',
				label:    'License',
				value:    description.License,
				onChange: actions.updateDescription.bind(this, 'License'),
			},
			{
				key:      'Acknowledgements',
				label:    'Acknowledgements',
				value:    description.Acknowledgements,
				onChange: actions.updateDescription.bind(this, 'Acknowledgements'),
			},
			{
				key:      'HowToAcknowledge',
				label:    'How to Acknowledge',
				value:    description.HowToAcknowledge,
				onChange: actions.updateDescription.bind(this, 'HowToAcknowledge'),
			},
			{
				key:      'Funding',
				label:    'Funding',
				value:    description.Funding,
				onChange: actions.updateDescription.bind(this, 'Funding'),
			},
			{
				key:      'ReferencesAndLinks',
				label:    'References and Links',
				value:    description.ReferencesAndLinks,
				onChange: actions.updateDescription.bind(this, 'ReferencesAndLinks'),
			},
			{
				key:         'DigitalDocuments',
				label:       'Digital Documents',
				type:        'fileArray',
				value:       dataset.attachments,
				onChange:    actions.uploadAttachment,
				onDelete:    actions.deleteAttachment,
				onFileClick: actions.getAttachmentDownloadTicket
			},
		];

		let fields = metadata.map((item) => {
			return (
				<div className="description-item" key={item.key}>
					<ClickToEdit
						value={item.value}
						label={item.label}
						type={item.type}
						editable={this.props.editable}
						onChange={item.onChange}
						onDelete={item.onDelete}
						onFileClick={item.onFileClick} />
				</div>
			);
		});

		return <div className="dataset-readme">{fields}</div>;
	}

});

export default MetaData;