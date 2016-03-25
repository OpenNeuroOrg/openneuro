// dependencies -------------------------------------------------------

import React          from 'react';
import AuthorInput    from './author-input.jsx';
import FileArrayInput from './file-array-input.jsx';
import Spinner        from '../partials/spinner.jsx';
import WarnButton     from './warn-button.jsx';

let ClickToEdit = React.createClass({

// life cycle events --------------------------------------------------

	getDefaultProps () {
		return {
			editable: true,
			type: 'string',
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
		let type = this.props.type;
		let input, display;

		switch (type) {
			case "string":
				display = <div className="cte-display"><div className="fadeIn">{value}</div></div>;
				input = (
					<div>
						<textarea className="form-control" value={value} onChange={this._handleChange.bind(null, type)}></textarea>
						<div className="btn-wrapper">
							<button className="cte-save-btn btn-admin-blue" onClick={this._save}>save</button>
						</div>
					</div>
				);
				break;
			case "authors":
				input = <AuthorInput value={value} onChange={this._handleChange.bind(null, type)} />;

				let items = value.map((item, index) => {
					return <div className="fadeIn" key={index}><span>{item.name} {item.ORCIDID ? '-' : null} {item.ORCIDID}</span></div>;
				});
				display = <div className="cte-display">{items}</div>;
				break;
			case "fileArray":
				let list = this.props.value.map((file, index) => {
					return (
						<div className="fadeIn file-array" key={file.name}>
							<span>
								<span className="file-array-btn">
									<WarnButton
										tooltip="Download Attachment"
										icon="fa-download"
										prepDownload={this._download.bind(null, file.name)} />
								</span>
								{file.name}
							</span>
						</div>
					);
				});
				input = <FileArrayInput
						value={this.props.value}
						onChange={this._handleFile}
						onDelete={this._handleDelete}
						onFileClick={this._download}/>;
				display = <div className="cte-display">{list}</div>;
				break;
		}

		let edit = (
			<div className="cte-edit fadeIn clearfix">
				{!this.state.loading ? input : null}
				<Spinner active={this.state.loading} />
			</div>
		);

		return (
			<div className="form-group" >
				<label>{this.props.label} {this._editBtn()}</label>
				<div>
					{this.state.edit ? edit : display}
				</div>
			</div>
    	);
	},

// template methods ---------------------------------------------------

	_editBtn() {
		let edit = this.state.edit;
		if (this.props.editable) {
			return (
				<button onClick={this._toggleEdit} className="cte-edit-button btn btn-admin fadeIn" >
					<span><i className={'fa fa-' + (edit ? 'times' : 'pencil')}></i> {edit ? 'Hide' : 'Edit'}</span>
				</button>
			);
		}
	},

// custom methods -----------------------------------------------------

	_display() {
		this.setState({edit: false});
	},

	_toggleEdit() {
		this.setState({edit: !this.state.edit});
	},

	_handleFile(file, callback) {
		if (this.props.onChange) {
			this.props.onChange(file, callback);
		}
	},

	_handleChange(type, event) {
		let callback;
		this.setState({value: event.target.value}, () => {
			if (type === 'authors') {
				this._save(type);
			}
		});
	},

	_handleDelete(filename, index) {
		if (this.props.onDelete) {
			this.props.onDelete(filename, index);
		}
	},

	_download(filename, callback) {
		if (this.props.onFileClick) {
			this.props.onFileClick(filename, callback);
		}
	},

	_save(type) {
		let self = this;
		this.setState({loading: true});
		let edit = type == 'authors' ? true : false;
		if (this.props.onChange) {
			this.props.onChange(this.state.value, () => {
				let initialValue = JSON.stringify(this.state.value);
				self.setState({loading: false, edit: edit, initialValue: initialValue});
			});
		}
	},

	_cancel() {
		let value = JSON.parse(this.state.initialValue);
		this.setState({edit: false, value: value});
	}

});

export default ClickToEdit;