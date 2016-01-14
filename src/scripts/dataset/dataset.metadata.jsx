// dependencies -------------------------------------------------------

import React        from 'react';
import Reflux       from 'reflux';
import Actions      from './dataset.actions.js';
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
	


		return (
			<div>
				<div className="fadeIn col-xs-12">
					<h3 className="metaheader">Analysis Run</h3>
					<Jobs />
				</div>
				<div className="col-xs-12">
					<div className="fileStructure fadeIn panel-group">
						<div className="panel panel-default">
							<div className="panel-heading" >
								<h4 className="panel-title">Dataset File Tree</h4>
							</div>
							<div className="panel-collapse" aria-expanded="false" >
								<div className="panel-body">
									<FileTree tree={[dataset]} editable={canEdit}/>
								</div>
							</div>
						</div>
					</div>
				</div>

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