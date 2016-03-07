// dependencies --------------------------------------------------------------

import React         from 'react';
import Reflux        from 'reflux';
import Tooltip       from './tooltip.jsx';
import FileSelect    from '../forms/file-select.jsx';
import UploadStore   from '../../upload/upload.store.js';
import actions       from '../../upload/upload.actions';
import notifications from '../../notification/notification.actions';

// component setup -----------------------------------------------------------

let Status = React.createClass({

	mixins: [Reflux.connect(UploadStore)],

// lifecycle events ----------------------------------------------------------

	render() {
		let spanClass, tip, iconClass, click, fileSelect, title;

		switch(this.props.type) {
			case 'public':
				spanClass = 'dataset-status ds-success';
				tip       = 'Viewable to all visitors';
				title	  = 'Public';
				iconClass = 'fa fa-globe';
				break;
			case 'incomplete':
				spanClass  = 'dataset-status ds-warning';
				tip        = 'Click to select your folder again and resume the upload';
				title	  = 'Incomplete';
				iconClass  = 'fa fa-warning';
				fileSelect = <span className="file-wrap"><FileSelect  onClick={this._clickHandler}  onChange={this._onFileSelect} /></span>;
				break;
			case 'shared':
				spanClass = 'dataset-status ds-info';
				tip       = 'Shared with me';
				title	  = 'Shared';
				iconClass = 'fa fa-user';
				break;
			case 'inProgress':
				spanClass = 'dataset-status ds-primary';
				tip       = 'Upload in progress';
				title	  = 'In progress';
				iconClass = 'fa fa-spin fa-circle-o-notch'
				break;
			case 'pendingValidation':
				spanClass = 'dataset-status ds-warning';
				tip       = 'Pending validation';
				title	  = 'Pending validation';
				iconClass = 'fa fa-hourglass-start';
		}

		return (
			<span className="clearfix status">
				<span className={spanClass}>
					<Tooltip tooltip={tip}>
						<span>
							<span className="icon-wrap">
								<i className={iconClass}></i>
								{title}
							</span>
							{fileSelect}
						</span>
					</Tooltip>
				</span>
			</span>
		);
	},

// custom methods ------------------------------------------------------------

	_clickHandler(e) {
		e.stopPropagation();
		if (this.state.uploadStatus === 'uploading') {
			e.preventDefault();
			notifications.createAlert({
				type: 'Warning',
				message: "You may only upload one dataset at a time. Please wait for the current upload to finish, then try resuming again."
			});
		}
	},

	_onFileSelect(files) {
		actions.onResume(files, this.props.dataset.label);
	}

});

export default Status;
