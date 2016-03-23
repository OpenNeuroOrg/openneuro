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
		if (!this.props.display) {return false};

		let spanClass, tip, iconClass, click, fileSelect, title;
		let minimal = this.props.minimal;

		switch(this.props.type) {
			case 'public':
				spanClass 	= 'dataset-status ds-success';
				tip       	= minimal ? 'Viewable to all visitors': null;
				title	  	= 'Published';
				iconClass 	= 'fa fa-globe';
				break;
			case 'incomplete':
				spanClass  	= 'dataset-status ds-warning';
				tip        	= 'Click resume to try again';
				title	 	= 'Incomplete';
				iconClass  	= 'fa fa-warning';
				fileSelect 	= <span className="file-wrap clearfix"><FileSelect resume={true} onChange={this._onFileSelect.bind(this)} /></span>;
				break;
			case 'shared':
				spanClass 	= 'dataset-status ds-info';
				tip       	= minimal ? 'Shared with me' : null;
				title	  	= 'Shared with me';
				iconClass 	= 'fa fa-user';
				break;
			case 'inProgress':
				spanClass 	= 'dataset-status ds-primary';
				tip       	= minimal ? 'Upload in progress' : null;
				title	  	= 'In progress';
				iconClass 	= 'fa fa-spin fa-circle-o-notch'
				break;
			case 'validating':
				spanClass 	= 'dataset-status ds-warning';
				tip       	= minimal ? 'Validating' : null;
				title	  	= !minimal ? 'Validating' : null;
				iconClass 	= 'fa fa-clock-o';
				break;
			case 'invalid':
				spanClass 	= 'dataset-status ds-danger';
				tip       	= minimal ? 'Invalid' : null;
				title	  	= 'Invalid';
				iconClass 	= 'fa fa-exclamation-circle';
		}

		let content = (
			<span>
				<span className="icon-wrap">
					<i className={iconClass}></i>
					{title}
				</span>
			</span>
		);

		let withTip = <Tooltip tooltip={tip}>{content}</Tooltip>;
		let withoutTip = <div>{content}</div>;

		return (
			<span>
				{minimal ? fileSelect : null}
				<span className="clearfix status">
					<span className={spanClass}>
					{tip ? withTip : withoutTip }
					</span>
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
