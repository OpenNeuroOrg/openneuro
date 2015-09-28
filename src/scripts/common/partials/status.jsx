// dependencies --------------------------------------------------------------

import React      from 'react';
import Tooltip    from './tooltip.component.jsx';
import FileSelect from '../forms/file-select.jsx';
import actions    from '../../upload/upload.actions';

// component setup -----------------------------------------------------------

export default class Status extends React.Component {

// lifecycle events ----------------------------------------------------------

	render() {
		let spanClass, tip, iconClass, click, fileSelect;
		
		switch(this.props.type) {
			case 'public':
				spanClass = 'dataset-status ds-info';
				tip       = 'Public';
				iconClass = 'fa fa-eye';
				break;
			case 'incomplete':
				spanClass  = 'dataset-status ds-warning';
				tip        = 'Incomplete. Click to select your folder again and resume the upload.';
				iconClass  = 'fa fa-warning';
				fileSelect = <FileSelect  onClick={this._clickHandler}  onChange={this._onFileSelect.bind(this)} />;
				break;
			case 'shared':
				spanClass = 'dataset-status ds-info';
				tip       = 'Shared with me.';
				iconClass = 'fa fa-user';
				break;
			case 'inProgress':
				spanClass = 'dataset-status ds-info';
				tip       = 'Upload in progress.';
				iconClass = 'fa fa-spin fa-circle-o-notch'
		}

		return (
			<span className={spanClass}>
				<Tooltip tooltip={tip}>
					<i className={iconClass}>
						{fileSelect}
					</i>
				</Tooltip>
			</span>
		);
	}

// custom methods ------------------------------------------------------------

	_clickHandler(e) {
		e.stopPropagation();
	}

	_onFileSelect(files) {
		actions.setInitialState({
			list: files.list,
			tree: files.tree,
			showRename: true,
			dirName: this.props.dataset.name
		});
		actions.validate(files.list, true);
	}

}

Status.propTypes = {
	type: React.PropTypes.string.isRequired	
};
