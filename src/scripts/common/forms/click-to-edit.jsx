// dependencies -------------------------------------------------------

import React          from 'react';
import ArrayInput     from './array-input.jsx';
import FileArrayInput from './file-array-input.jsx';
import Spinner        from '../partials/spinner.component.jsx';
import request        from '../../utils/request';

let ClickToEdit = React.createClass({

// life cycle events --------------------------------------------------

	getDefaultProps () {
		return {
			editable: true,
			value: '',
			dataUrl: 'test'
		};
	},

	getInitialState() {
		return {
			value: this.props.value,
			initialValue: JSON.stringify(this.props.value),
			loading: false
		};
	},

	componentDidMount() {
		// if (this.props.type == 'fileArray') {
  //               var windowUrl = window.URL || window.webkitURL;
		// 	let projectId = '55e4b6999002f24d784b3f92';
		// 	let mimetype = this.props.value[0].mimetype;
		// 	console.log(this.props.value);
		// 	let url = 'projects/' + projectId + '/file/' + this.props.value[0].name;
		// 	this._downloadFile(url, (res) => {
		// 		let blob = new Blob([res], {type: mimetype});
		// 		let dataUrl = windowUrl.createObjectURL(blob);
		// 		this.setState({dataUrl});
		// 	});
		// }
	},

	render() {
		let value = this.state.value;
		let type = this.props.type ? this.props.type : typeof value;
		let input;
		let display
		switch (type) {
			case "string":
				input = <textarea className="form-control" value={value} onChange={this._handleChange}></textarea>;
				display = <div className="cte-display"><div className="fadeIn">{value}</div></div>;
				break;
			case "object":
				input = <ArrayInput value={value} onChange={this._handleChange} />;
				display = <div className="cte-display"><div className="fadeIn">{value}</div></div>;
				break;
			case "fileArray":
				let list = value.map((file, index) => {
					let projectId = '55f1ea5f9002f248c3a7f195';
					let url = 'projects/' + projectId + '/file/' + file.name;
					return <a download={file.name} href={file.dataUrl} target="_blank">{file.name}</a>
				});
				input = <FileArrayInput value={value} onChange={this._handleFile} />;
				display = <div className="cte-display"><div className="fadeIn">{list}</div></div>;
				break;
		}

		let editBtn;
		if (this.props.editable) {
			editBtn = <button onClick={this._edit} className="cte-edit-button btn btn-admin fadeIn"><span>edit </span><i className="fa fa-pencil"></i></button>;
		}

		let edit = (
			<div className="cte-edit fadeIn">
				{input}
				<div className="btn-wrapper">
					<button className="cte-cancel-btn btn btn-admin cancel" onClick={this._cancel}>cancel</button>
					<button className="cte-save-btn btn btn-admin admin-blue " onClick={this._save}>save</button>
					</div>
				<Spinner active={this.state.loading} />
			</div>
		);

		return (
			<div className="form-group" >
				<label>{this.props.label} {!this.state.edit ? editBtn : null}</label>
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

	_handleFile(file) {
		if (this.props.onChange) {
			this.props.onChange(file);
		}
	},

	_downloadFile(url, callback) {
		request.get(url, {}, function (err, res) {
			callback(res.text);
		});
	},

	_handleChange(event) {
		this.setState({value: event.target.value});
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