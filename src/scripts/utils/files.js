// dependencies -------------------------------------------------------------------

import config from '../config';

// public API ---------------------------------------------------------------------

let fileUtils = {
	generateTree,
    countTree,
    findInTree,
    read
};

export default fileUtils;

// implementations ----------------------------------------------------------------

/**
 * Generate Tree
 *
 * Takes a files object of a selected directory
 * and restructures them from a flat array to a
 * tree following the structure of the original
 * directory.
 */
function generateTree (files) {
	let pathList = {};
	let dirTree = {};

    // generate list of paths
	for (let i = 0; i < files.length; i++) {
		let file = files[i];
        // ignore blacklisted files
        if (config.upload.blacklist.indexOf(file.name) > -1) {continue;}
        pathList[file.webkitRelativePath] = file;
    }

    // build path from list
    for (let key in pathList) {
    	let path = key;
    	let pathParts = path.split('/');
    	let subObj = dirTree;
    	for (let j = 0; j < pathParts.length; j++) {
    		let part = pathParts[j];
    		if (!subObj[part]) {
    			subObj[part] = j < pathParts.length - 1 ? {} : pathList[key];
    		}
    		subObj = subObj[part];
    	}
    }

	// convert dirTree to array structure
    function objToArr (obj) {
    	let arr = [];
    	for (let key in obj) {
    		if (obj[key].webkitRelativePath && obj[key].webkitRelativePath.length > 0) {
    			arr.push(obj[key]);
    		} else {
    			arr.push({name: key, type: 'folder', children: objToArr(obj[key])});
    		}
    	}
    	return arr;
	}

	dirTree = objToArr(dirTree);

    // return tree
    return dirTree;
}

/**
 * Count Tree
 *
 * Takes a BIDS tree object and returns
 * a total count of files and folders.
 */
function countTree (tree) {
    let count = 0;
    function recurse (tree) {
        for (let item of tree) {
            count++
            if (item.children) {recurse(item.children);}
        }
    }
    recurse(tree);
    return count;
}

/**
 * Find In Tree
 *
 * Takes a file tree and an object id and
 * returns the corresponding object from
 * the tree.
 */
function findInTree (tree, id) {
    let match, subTree;
    for (let item of tree) {
        if (item.children) {subTree = item.children;}
        if (item._id == id) {
            return item;
        } else if (subTree) {
            match = findInTree(subTree, id);
            if (match) {return match;}
        }
    }
}

/**
 * Read
 *
 * A helper method for reading file contents.
 * Takes a file object and a callback and calls
 * the callback with the text contents of the
 * file as the only argument.
 */
function read (file, callback) {
    var reader = new FileReader();
    reader.onloadend = function (e) {
        if (e.target.readyState == FileReader.DONE) {
            callback(e.target.result);
        }
    };
    reader.readAsBinaryString(file);
}
