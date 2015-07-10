// public API ---------------------------------------------------------------------

let fileUtils = {
	generateTree
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
        if (blacklist.indexOf(file.name) > -1) {continue;}
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

let blacklist = [
    '.DS_Store'
];