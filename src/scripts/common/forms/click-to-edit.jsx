// dependencies -------------------------------------------------------

import React          from 'react';
import AuthorInput    from './author-input.jsx';
import FileArrayInput from './file-array-input.jsx';
import Spinner        from '../partials/spinner.component.jsx';
import request        from '../../utils/request';

let ClickToEdit = React.createClass({

// life cycle events --------------------------------------------------

	getDefaultProps () {
		return {
			editable: true,
			value: ''
		};
	},

	getInitialState() {
		return {
			value: this.props.value,
			initialValue: JSON.stringify(this.props.value),
			loading: false
		};
	},

	render() {
		let value = this.state.value;
		let type = this.props.type ? this.props.type : typeof value;
		let input;
		let display;

		let editBtn;
		if (this.props.editable && !this.state.edit) {
			editBtn = <button onClick={this._edit} className="cte-edit-button btn btn-admin fadeIn"><span>edit </span><i className="fa fa-pencil"></i></button>;
		}

		let buttons = (
			<div className="btn-wrapper">
				<button className="cte-cancel-btn btn btn-admin cancel" onClick={this._cancel}>cancel</button>
				<button className="cte-save-btn btn btn-admin admin-blue " onClick={this._save}>save</button>
			</div>
		);

		switch (type) {
			case "string":
				input = <textarea className="form-control" value={value} onChange={this._handleChange}></textarea>;
				display = <div className="cte-display"><div className="fadeIn">{value}</div></div>;
				break;
			case "authors":
				input = <AuthorInput value={value} onChange={this._handleChange} />;
				let items = value.map((item, index) => {
					return <div className="fadeIn" key={index}><span>{item.name} {item.ORCIDID ? '-' : null} {item.ORCIDID}</span></div>;
				});
				display = <div className="cte-display">{items}</div>;
				break;
			case "fileArray":
				let list = this.props.value.map((file, index) => {
					return <div className="fadeIn" key={file.name}><span><a onClick={this._download.bind(null, file.name)}>{file.name}</a></span></div>;
				});
				input = <FileArrayInput
						value={this.props.value}
						onChange={this._handleFile}
						onDelete={this._handleDelete}
						onFileClick={this._download}/>;
				display = <div className="cte-display">{list}</div>;
				buttons = (
					<div className="btn-wrapper">
						<button className="cte-save-btn btn btn-admin admin-blue " onClick={this._cancel}>done</button>
					</div>
				)
				break;
		}

		let edit = (
			<div className="cte-edit fadeIn">
				{input}
				{buttons}
				<Spinner active={this.state.loading} />
			</div>
		);

		return (
			<div className="form-group" >
				<label>{this.props.label} {editBtn}</label>
				<div>
					{this.state.edit ? edit : display}
				</div>
			</div>
    	);
	},

// custon methods -----------------------------------------------------

	_display() {
		this.setState({edit: false});
	},

	_edit() {
		this.setState({edit: true});
	},

	_handleFile(file, callback) {
		if (this.props.onChange) {
			this.props.onChange(file, callback);
		}
	},

	_handleChange(event) {
		this.setState({value: event.target.value});
	},

	_handleDelete(filename, index) {
		if (this.props.onDelete) {
			this.props.onDelete(filename, index);
		}
	},

	_download(filename) {
		if (this.props.onFileClick) {
			this.props.onFileClick(filename);
		}
	},

	_save() {
		let self = this;
		this.setState({loading: true});
		if (this.props.onChange) {
			this.props.onChange(this.state.value, () => {
				let initialValue = JSON.stringify(this.state.value);
				self.setState({loading: false, edit: false, initialValue: initialValue});
			});
		}
	},

	_cancel() {
		let value = JSON.parse(this.state.initialValue);
		this.setState({edit: false, value: value});
	}

});

export default ClickToEdit;