import React from 'react'
import request from 'superagent'
import jquery from '../../libs/jquery.min';
import tree from '../../libs/jquery.tree';

let FS_upload = React.createClass({
//==========================================================================================================================
        _treeRender: function(object) {
            let self = this;
            console.log(object);
            if (object) {
                for (var folder in object) {
                    if (!object[folder]) { // file's will have a null value
                        this.state.html_.push('<li><a href="#" data-type="file">', folder, '</a></li>');
                    } else {
                        this.state.html_.push('<li><a href="#">', folder, '</a>');
                        this.state.html_.push('<ul>');
                        self._treeRender(object[folder]);
                        this.state.html_.push('</ul>');
                    }
                }
            }
        },
        _buildFromPathList: function(paths) {
            let self = this;
            for (var i = 0, path; path = paths[i]; ++i) {
                var pathParts = path.split('/');
                var subObj =  this.state.tree_;
                for (var j = 0, folderName; folderName = pathParts[j]; ++j) {
                    if (!subObj[folderName]) {
                        subObj[folderName] = j < pathParts.length - 1 ? {} : null;
                    }
                    subObj = subObj[folderName];
                }
            }
            return this.state.tree_;
        },
        _handleChange: function(e) {
            // Reset  
            this.setState({
                el: $('#dir-tree'),
                html_: [],
                tree_: {},
            });
            let self = this;
            let pathList_ = [];
            self.fileList =  e.target.files;
            // TODO: optimize this so we're not going through the file list twice
            // (here and in buildFromPathList).
            for (var i = 0, file;  file = self.fileList[i]; ++i) {
                console.log('filesList loop ran')
                pathList_.push(file.name + file.webkitRelativePath);
            }
            self._treeRender(self._buildFromPathList(pathList_));
            this.state.$el.html(this.state.html_.join('')).tree({
                expanded: 'li:first'
            });
            // Add full file path to each DOM element.       
            var fileNodes = this.state.$el.get(0).querySelectorAll("[data-type='file']");
            for (var i = 0, fileNode; fileNode = fileNodes[i]; ++i) {
                fileNode.dataset['index'] = i;
            }
        },
//==========================================================================================================================
        getInitialState: function(){
            window.URL =    window.URL ? window.URL :
                            window.webkitURL ? window.webkitURL : window;
            let pathList_ = [];
            let self = this;
            this.fileList = [];
            return({ 
                $el: $('#dir-tree'),
                html_: [],
                tree_: {},
            })

        },
        componentDidMount: function(){
            let self = this;
            this.setState({
                $el: $('#dir-tree'),
            });
        },
        render: function () {
        let self = this;
        return (
        <div id="container">
            <div>
                <input type="file" id="file_input"  directory webkitdirectory onChange={self._handleChange}/>
                <ul id="dir-tree"></ul>
            </div>
            <div className="center" id="thumbnails"></div>
        </div>
        );
    },
});

module.exports = FS_upload;

