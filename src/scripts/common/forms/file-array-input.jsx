// dependencies -------------------------------------------------------

import React      from 'react';
import Spinner    from '../../common/partials/spinner.jsx';
import WarnButton from './warn-button.jsx';

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
					<WarnButton
						tooltip="Download Attachment"
						icon="fa-download"
						prepDownload={this._download.bind(null, item.name)} />
					<span className="file-name">{item.name}</span>
					<div className="btn-wrap">
						<WarnButton message="Delete" action={this._remove.bind(null, item.name, index)} />
					</div>
				</div>
			);
		});

		return (
			<div className="cte-edit-array">
				{this._error(this.state.error)}
				<div className="cte-array-items clearfix">{items}</div>
				{this.state.loading ? <Spinner active={true} /> : <div className="add-file"><span>Add a file</span><input type="file" onChange={this._handleChange}/></div>}
			</div>
		)
	},

// template methods ---------------------------------------------------

	_error(error) {
		if (error) {
			return (
				<div className="alert alert-danger">
					<button className="close" onClick={this._dismissError}><span>&times;</span></button>
					{this.state.error}
				</div>
			);
		}
	},

// actions ------------------------------------------------------------

	_download(filename, callback) {
		if (this.props.onFileClick) {
			this.props.onFileClick(filename, callback);
		}
	},

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

	_dismissError() {
		this.setState({error: null});
	}

});

export default FileArrayInput;