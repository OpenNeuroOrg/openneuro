// dependencies --------------------------------------------------------------

import React      from 'react';
import Tooltip    from './tooltip.jsx';
import FileSelect from '../forms/file-select.jsx';
import actions    from '../../upload/upload.actions';

// component setup -----------------------------------------------------------

export default class Status extends React.Component {

// lifecycle events ----------------------------------------------------------

	render() {
		let spanClass, tip, iconClass, click, fileSelect, title;

		switch(this.props.type) {
			case 'public':
				spanClass = 'dataset-status ds-success';
				tip       = 'This is viewable to all visitors';
				title	  = 'Public';
				iconClass = 'fa fa-globe';
				break;
			case 'incomplete':
				spanClass  = 'dataset-status ds-warning';
				tip        = 'Click to select your folder again and resume the upload.';
				title	  = 'Incomplete';
				iconClass  = 'fa fa-warning';
				fileSelect = <span className="file-wrap"><FileSelect  onClick={this._clickHandler}  onChange={this._onFileSelect.bind(this)} /></span>;
				break;
			case 'shared':
				spanClass = 'dataset-status ds-info';
				tip       = 'Shared with me.';
				title	  = 'Shared';
				iconClass = 'fa fa-user';
				break;
			case 'inProgress':
				spanClass = 'dataset-status ds-primary';
				tip       = 'Upload in progress.';
				title	  = 'In progress';
				iconClass = 'fa fa-spin fa-circle-o-notch'
		}

		return (
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
