// dependencies -------------------------------------------------------

import React      from 'react';
import actions    from './dataset.actions';
import WarnButton from '../common/forms/warn-button.jsx';
import Spinner    from '../common/partials/spinner.jsx';

class FileTree extends React.Component {

// life cycle events --------------------------------------------------
	render () {
		let tree = this.props.tree ? this.props.tree : [];
		let nodes = tree.map((item, index) => {
			if (!item.label && item.filename) {item.label = item.filename;}
			let typeIcon, typeIconOpen, tools, fileTools, error, loading, editBtn;

			// loading animation
			if (item.loading) {
				loading = <span className="warning-loading"><i className="fa fa-spin fa-circle-o-notch"></i></span>;
			}

			// inline error
			if (item.error) {
				error = <div className="message error">{item.error} <span onClick={actions.dismissError.bind(this, item)}><i className="fa fa-times"></i></span></div>;
			}

			// folders
			if (item.children) {
				typeIcon  = <button className={"type-icon fa " + (item.showChildren ? "fa-folder-open" : "fa-folder")} onClick={actions.toggleFolder.bind(this, item)}></button>;
			}

			return (
				<li className="clearfix" key={item.label ? item.label : item.name}>
					<span className="item-name">
						{typeIcon} {item.label ? item.label : item.name}
					</span>
					{this._fileTools(item)}
					{error}
					{loading}
					{item.showChildren ? <ul className="child-files"><FileTree tree={item.children} editable={this.props.editable}/></ul> : null}
					{editBtn}
				</li>
			);
		});

		return <ul className="top-level-item">{this.props.loading ? <Spinner active={true} text="Loading Files" /> : nodes}</ul>;
	}

// template methods ---------------------------------------------------

	_fileTools(item) {

		let deleteFile, editFile, addFile;
		if (this.props.editable) {
			if (item.children && item.showChildren) {
				addFile = (
					<div className="edit-file">
						<span><i className="fa fa-plus"></i> Add File</span>
						<input
							type="file"
							className="add-files"
							ref={item.label}
							onChange={this._addFile.bind(this, item)}
							onClick={this._clearInput.bind(this, item.label)}/>
					</div>
				);
			} else if (!item.children) {
				deleteFile = (
					<span className="delete-file">
						<WarnButton
							icon="fa-trash"
							message="Delete"
							action={actions.deleteFile.bind(this, item)} />
					</span>
				);

				editFile = (
					<div className="edit-file">
						<span><i className="fa fa-file-o"></i> Update</span>
						<input
							type="file"
							className="update-file"
							ref={item.name}
							onChange={this._updateFile.bind(this, item)}
							onClick={this._clearInput.bind(this, item.name)}/>
					</div>
				);
			}
		}

		let downloadFile;
		if (!item.children) {
			downloadFile = (
				<span className="download-file">
					<WarnButton
						icon="fa-download"
						message="Download"
						prepDownload={actions.getFileDownloadTicket.bind(this, item)} />
				</span>
			);
		}

		if (addFile || editFile || deleteFile || downloadFile) {
			return (
				<span className="fileTreeEditFile">
					{addFile}
					{editFile}
					{deleteFile}
					{downloadFile}
				</span>
			);
		} else {return false;}

	}

// custom methods -----------------------------------------------------

	/**
	 * Add File
	 */
	_addFile(container, event) {actions.addFile(container, event.target.files[0]);}

	/**
	 * Clear Input
	 */
	_clearInput(ref) {
		React.findDOMNode(this.refs[ref]).value = null;
	}

	/**
	 * Update File
	 */
	_updateFile(item, event) {actions.updateFile(item, event.target.files[0]);}

}

export default FileTree;