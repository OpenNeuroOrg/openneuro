// dependencies -------------------------------------------------------

import React      from 'react';
import upload     from '../../utils/upload';
import Spinner    from '../../common/partials/spinner.component.jsx';
import WarnButton from './warn-button.component.jsx';

// component setup ----------------------------------------------------

let FileArrayInput = React.createClass({

// life cycle events --------------------------------------------------

	getDefaultProps () {
		return {
			value: []
		};
	},

	getInitialState() {
		return {
			loading: false
		};
	},

	render() {
		let items = this.props.value.map((item, index) => {
			return (
				<div key={index} className="cte-array-item">
					<a className="file-name" onClick={this._fileClick.bind(null, item.name)}>{item.name}</a>
					<div className="btn-wrap">
						<WarnButton action={this._remove.bind(null, item.name, index)} />
					</div>
				</div>
			);
		});

		return (
			<div className="cte-edit-array">
				<div className="cte-array-items clearfix">{items}</div>
				{this.state.loading ? <Spinner active={true} /> : <input type="file" onChange={this._handleChange}/>}
			</div>
		)
	},

// custon methods -----------------------------------------------------

	_handleChange(e) {
		let file = e.target.files[0];
		if (this.props.onChange) {
			this.setState({loading: true});
			this.props.onChange(file, () => {
				this.setState({loading: false});
			});
		}
	},

	_remove(filename, index) {
		if (this.props.onDelete) {
			this.props.onDelete(filename, index);
		}
	},

	_fileClick(filename) {
		if (this.props.onFileClick) {
			this.props.onFileClick(filename);
		}
	}

});

export default FileArrayInput;