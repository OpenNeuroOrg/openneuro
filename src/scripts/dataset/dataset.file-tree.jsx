// dependencies -------------------------------------------------------

import React   from 'react';
import actions from './dataset.actions';

class FileTree extends React.Component {

// life cycle events --------------------------------------------------

	render () {
		let tree = this.props.tree ? this.props.tree : [];
		let nodes = tree.map((item, index) => {
			if (!item.name && item.filename) {item.name = item.filename;}
			let icon, tools;
			if (item.children) {
				icon  = <i className="fa fa-folder" onClick={this._toggleFolder.bind(this, item._id)}></i>;
				tools = (
					<span>
						<input type="file" className="add-files" onChange={this._addFile.bind(this, item)}/>
					</span>
				);
			} else {
				icon  = <i className="fa fa-file"></i>;
				tools = (
					<span>
						<div>{item.error}</div>
						<button onClick={this._deleteFile.bind(this, item)}>delete</button>
						<input type="file" className="update-file" onChange={this._updateFile.bind(this, item)}/>
					</span>
				);
			}

			return (
				<li key={index}>{icon} {item.name} {tools}
					{item.showChildren ? <ul><FileTree tree={item.children} /></ul> : null}
				</li>
			);
		});
		return (
			<ul>{nodes}</ul>
    	);
	}

// custom methods -----------------------------------------------------

	/**
	 * Toggle Folder
	 */
	_toggleFolder(folderId) {actions.toggleFolder(folderId);}

	/**
	 * Add File
	 */
	_addFile(container, event) {
		let file = event.target.files[0];
		let exists;
		for (let existingFile of container.children) {
			if (existingFile.name === file.name) {
				exists = true;
			}
		}

		if (exists) {
			console.log('File "' + file.name + '" already exists.');
		} else {
			console.log('Upload file');
		}
	}

	/**
	 * Update File
	 */
	_updateFile(item, event) {actions.updateFile(item, event.target.files[0]);}

	/**
	 * Delete File
	 */
	_deleteFile(file) {actions.deleteFile(file);}

}

export default FileTree;