import React   from 'react';
import Tooltip from './tooltip.component.jsx';

export default class Status extends React.Component {
	
	render() {
		let spanClass, tip, iconClass;
		
		switch(this.props.type) {
			case 'public':
				spanClass = 'dataset-status ds-info';
				tip       = 'public';
				iconClass = 'fa fa-eye';
				break;
			case 'incomplete':
				spanClass = 'dataset-status ds-warning';
				tip       = 'Incomplete. Select your folder again and use the same name to resume upload.';
				iconClass = 'fa fa-warning';
				break;
			case 'shared':
				spanClass = 'dataset-status ds-info';
				tip       = 'shared with me';
				iconClass = 'fa fa-user';
				break;
		}

		return (
			<span className={spanClass}>
				<Tooltip tooltip={tip}><i className={iconClass}></i></Tooltip>
			</span>
		);
	}
}

Status.propTypes = {
	type: React.PropTypes.string.isRequired	
};
