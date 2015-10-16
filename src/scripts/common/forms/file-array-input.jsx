// dependencies -------------------------------------------------------

import React      from 'react';
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

		let error;
		if (this.state.error) {
			error = (
				<div className="alert alert-danger">
					<button className="close" onClick={this._dismissError}><span>&times;</span></button>
					{this.state.error}
				</div>
			);
		}

		return (
			<div className="cte-edit-array">
				{error}
				<div className="cte-array-items clearfix">{items}</div>
				{this.state.loading ? <Spinner active={true} /> : <input type="file" onChange={this._handleChange}/>}
			</div>
		)
	},

// custon methods -----------------------------------------------------

	_handleChange(e) {
		let file = e.target.files[0];
		if (this.props.onChange) {
			this.setState({loading: true, error: null});
			this.props.onChange(file, (res) => {
				let error = res ? res.error : null;
				this.setState({loading: false, error: error});
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
	},

	_dismissError() {
		this.setState({error: null});
	}

});

export default FileArrayInput;