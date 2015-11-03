// dependencies -------------------------------------------------------

import React      from 'react';
import actions    from './dataset.actions';
import WarnButton from '../common/forms/warn-button.jsx';

class FileTree extends React.Component {

// life cycle events --------------------------------------------------
	render () {
		let tree = this.props.tree ? this.props.tree : [];
		let nodes = tree.map((item, index) => {
			if (!item.name && item.filename) {item.name = item.filename;}
			let typeIcon, typeIconOpen, tools, fileTools, error, loading, editBtn;

			// loading animation
			if (item.loading) {
				loading = <span><i className="fa fa-spin fa-circle-o-notch"></i></span>;
			}

			// inline error
			if (item.error) {
				error = <div>{item.error} <span onClick={this._dismissError.bind(this, item)}><i className="fa fa-times"></i></span></div>;
			}

			// folders
			if (item.children) {
				typeIcon  = <i className="fa fa-folder"></i>;
				typeIconOpen = <i className="fa fa-folder-open"></i>;
				let editText = <span><i className="fa fa-pencil"></i> Edit</span>;
				let hideText = <span><i className="fa fa-times"></i> Hide</span>;

				if (this.props.editable) {
					editBtn = <button onClick={this._toggleFolder.bind(this, item)} className="cte-edit-button btn btn-admin fadeIn" >{item.showChildren ? hideText : editText}</button>
				}
				tools = (
					<span> -
						<input
							type="file"
							className="add-files"
							ref={item.name}
							onChange={this._addFile.bind(this, item)}
							onClick={this._clearInput.bind(this, item.name)}/>
					</span>
				);
			}

			// files
			else if(this.props.editable) {
				typeIcon  = <i className="fa fa-file"></i>;
				fileTools = (
					<span className="fileTreeEditFile"> -
						<span className="delete-file">
							<WarnButton action={this._deleteFile.bind(this, item)} />
						</span>
						<span className="edit-file">
							<input
								type="file"
								className="update-file"
								ref={item.name}
								onChange={this._updateFile.bind(this, item)}
								onClick={this._clearInput.bind(this, item.name)}/>
						</span>
					</span>
				);
			}

			return (
				<li key={item.name}>{this.props.editable && item.showChildren ? typeIconOpen : typeIcon} {item.name} {error} {this.props.editable ? editBtn : null} {this.props.editable && item.showChildren ? tools : fileTools} {loading}
					{item.showChildren ? <ul className="child-files"><FileTree tree={item.children} editable={this.props.editable}/></ul> : null}
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
	_addFile(container, event) {actions.addFile(container, event.target.files[0]);}

	/**
	 * Clear Input
	 */
	_clearInput(ref) {
		React.findDOMNode(this.refs[ref]).value = null;
	}

	/**
	 * Delete File
	 */
	_deleteFile(file) {actions.deleteFile(file);}

	/**
	 * Dismiss Error
	 */
	 _dismissError(item) {actions.dismissError(item);}

	/**
	 * Toggle Folder
	 */
	_toggleFolder(folder) {actions.toggleFolder(folder);}

	/**
	 * Update File
	 */
	_updateFile(item, event) {actions.updateFile(item, event.target.files[0]);}

}

export default FileTree;