// dependencies -------------------------------------------------------

import React      from 'react';
import actions    from './dataset.actions';
import WarnButton from '../common/forms/warn-button.jsx';
import Spinner    from '../common/partials/spinner.jsx';

class FileTree extends React.Component {

// life cycle events --------------------------------------------------

    render () {
        let editable = this.props.editable;
        let tree     = this.props.tree;
        let nodes = tree.map((item) => {
            let name = item.label ? item.label : item.name;

            return (
                <li className="clearfix" key={name}>
                    <span className="item-name">
                        {this._folderIcon(item)} {this._fileLoading(item.loading)}
                    </span>
                    {this._fileTools(item, editable)}
                    {this._error(item)}
                    {this._children(item, editable)}
                </li>
            );
        });

        return (
            <ul className="top-level-item">
                {this.props.loading ? <Spinner active={true} text="Loading Files" /> : nodes}
            </ul>
        );
    }

// template methods ---------------------------------------------------

    _children(item, editable) {
        if (item.showChildren) {
            return <ul className="child-files"><FileTree tree={item.children} editable={editable}/></ul>;
        }
    }

    _error(item) {
        if (item.error) {
            return (
                <div className="message error">
                    {item.error + ' '}
                    <span onClick={actions.dismissError.bind(this, item)}>
                        <i className="fa fa-times"></i>
                    </span>
                </div>
            );
        }
    }

    _fileLoading(loading) {
        if (loading) {
            return <span className="warning-loading"><i className="fa fa-spin fa-circle-o-notch"></i></span>;
        }
    }

    _fileTools(item, editable) {

        let deleteFile, editFile, addFile;
        if (editable) {
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

    _folderIcon(item) {
        let label = item.label ? item.label : item.name;
        if (item.children) {
            let iconClass = 'type-icon fa ' + (item.showChildren ? 'fa-folder-open' : 'fa-folder');
            return <button className="btn-file-folder" onClick={actions.toggleFolder.bind(this, item)}><i className={iconClass}></i> {label}</button>;
        }else{
            return label;
        }
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

FileTree.props = {
    editable: false,
    loading:  false,
    tree:     []
};

FileTree.propTypes = {
    editable: React.PropTypes.bool,
    loading:  React.PropTypes.bool,
    tree:     React.PropTypes.array
};

export default FileTree;