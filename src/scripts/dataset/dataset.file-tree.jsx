// dependencies -------------------------------------------------------

import React   from 'react';
import actions from './dataset.actions';

class FileTree extends React.Component {

// life cycle events --------------------------------------------------

	render () {
		let tree = this.props.tree ? this.props.tree : [];
		let nodes = tree.map((item, index) => {
			let icon, tools;
			if (item.children) {
				icon  = <i className="fa fa-folder"></i>;
				tools = (
					<span>
						<button>rename</button>
						{!item.hasOwnProperty('status') ? <button>delete</button> : null}
						<input type="file" className="add-files" onChange={this._addFile.bind(this, item)}/>
					</span>
				);
			} else {
				icon  = <i className="fa fa-file"></i>;
				tools = (
					<span>
						<div>error</div>
						<button>delete</button>
						<input type="file" className="update-file" onChange={this._updateFile.bind(this, item.parentId, item.parentContainer, item.name)}/>
					</span>
				);
			}

			return (
				<li key={index}>{icon} {item.name} {tools}
					<ul><FileTree tree={item.children} /></ul>
				</li>
			);
		});
		return (
			<ul>{nodes}</ul>
    	);
	}

// custom methods -----------------------------------------------------

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
	_updateFile(id, level, filename, event) {
		let file = event.target.files[0];
		if (filename !== file.name) {
			console.log(filename, file.name);
			return;
		} else {
			actions.updateFile(level, id, file, (err, res) => {
				console.log(err);
				console.log(res);
			});
		}
	}

}

export default FileTree;


// <input type="file" onChange={this._handleFile.bind(this, item.parentId, item.parentContainer, item.name)}/>