// dependencies --------------------------------------------------------------

import React         from 'react';
import Reflux        from 'reflux';
import Tooltip       from './tooltip.jsx';
import FileSelect    from '../forms/file-select.jsx';
import actions       from '../../upload/upload.actions';

// component setup -----------------------------------------------------------

class Status extends React.Component {

// lifecycle events ----------------------------------------------------------

	render() {
		let spanClass, tip, iconClass, click, fileSelect, title;

		switch(this.props.type) {
			case 'public':
				spanClass = 'dataset-status ds-success';
				tip       = 'Viewable to all visitors';
				title	  = 'Published';
				iconClass = 'fa fa-globe';
				break;
			case 'incomplete':
				spanClass  = 'dataset-status ds-warning';
				tip        = 'Click to select your folder again and resume the upload';
				title	  = 'Incomplete';
				iconClass  = 'fa fa-warning';
				fileSelect = <span className="file-wrap"><FileSelect resume={true} onChange={this._onFileSelect.bind(this)} /></span>;
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
				break;
			case 'invalid':
				spanClass = 'dataset-status ds-danger';
				tip       = 'Invalid';
				title	  = 'Invalid';
				iconClass = 'fa fa-ban';
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
							{this.props.actionable ? fileSelect : null}
						</span>
					</Tooltip>
				</span>
			</span>
		);
	}

// custom methods ------------------------------------------------------------

	_onFileSelect(files) {
		actions.onResume(files, this.props.dataset.label);
	}

}

export default Status;
