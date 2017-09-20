// dependencies -------------------------------------------------------------------

import newId from './newid'

// public API ---------------------------------------------------------------------

let fileUtils = {
  generateTree,
  findInTree,
  read,
  hasExtension,
  sortTree,
}

export default fileUtils

// implementations ----------------------------------------------------------------

/**
 * Generate Tree
 *
 * Takes a files object of a selected directory
 * and restructures them from a flat array to a
 * tree following the structure of the original
 * directory.
 */
function generateTree(files) {
  let pathList = {}
  let dirTree = {}

  // generate list of paths
  for (let i = 0; i < files.length; i++) {
    let file = files[i]
    pathList[file.webkitRelativePath] = file
  }

  // build path from list
  for (let key in pathList) {
    let path = key
    let pathParts = path.split('/')
    let subObj = dirTree
    for (let j = 0; j < pathParts.length; j++) {
      let part = pathParts[j]
      if (!subObj[part]) {
        subObj[part] = j < pathParts.length - 1 ? {} : pathList[key]
      }
      subObj = subObj[part]
    }
  }

  // convert dirTree to array structure
  function objToArr(obj, parentId = 'root', path = '') {
    let arr = []
    for (let key in obj) {
      if (
        obj[key].webkitRelativePath &&
        obj[key].webkitRelativePath.length > 0
      ) {
        obj[key]._id = newId('file-')
        obj[key].parentId = parentId
        arr.push(obj[key])
      } else {
        let folderId = newId('folder-')
        let dirPath = path + key + '/'
        arr.push({
          _id: folderId,
          dirPath,
          name: key,
          type: 'folder',
          children: objToArr(obj[key], folderId, dirPath),
        })
      }
    }
    return arr
  }

  dirTree = objToArr(dirTree)
  sortTree(dirTree)

  // return tree
  return dirTree
}

/**
 * Sort Tree
 */
function sortTree(tree) {
  // sort alaphabetical files before folders
  if (tree && tree.length > 0) {
    let sortStrategy = (a, b) => {
      let aName = a.name.toLowerCase(),
        bName = b.name.toLowerCase(),
        aIsFolder = a.type == 'folder' || a.format == 'folder',
        bIsFolder = b.type == 'folder' || b.format == 'folder'

      if (!aIsFolder && bIsFolder) {
        return -1
      } else if (aIsFolder && !bIsFolder) {
        return 1
      } else if (aName < bName) {
        return -1
      } else if (aName > bName) {
        return 1
      } else {
        return 0
      }
    }

    // recursively apply sorting
    for (let item of tree) {
      if (item.children && item.children.length > 0) {
        sortTree(item.children)
        item.children.sort(sortStrategy)
      }
    }
    tree.sort(sortStrategy)
  }
}

/**
 * Find In Tree
 *
 * Takes a file tree and an object id and
 * returns the corresponding object from
 * the tree.
 */
function findInTree(tree, id, prop) {
  if (id === 'root') {
    return tree[0]
  }
  prop = prop ? prop : '_id'
  let match, subTree
  for (let item of tree) {
    if (item.children) {
      subTree = item.children
    }
    if (item[prop] == id) {
      return item
    } else if (subTree) {
      match = findInTree(subTree, id, prop)
      if (match) {
        return match
      }
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
function read(file, callback) {
  var reader = new FileReader()
  reader.onloadend = function(e) {
    if (e.target.readyState == FileReader.DONE) {
      callback(e.target.result)
    }
  }
  reader.readAsText(file)
}

/**
 * Has Extension
 *
 * Takes a file name and a list of file extensions and
 * returns true if the file ends with one of the extensions.
 */
function hasExtension(fileName, extensionList) {
  for (let extension of extensionList) {
    if (endsWith(fileName, extension)) {
      return true
    }
  }
  return false
}

/**
 * Ends With
 *
 * Takes a string and a suffix and returns true
 * if the string ends in the suffix
 */
function endsWith(str, suffix) {
  return (
    str
      .toLowerCase()
      .indexOf(suffix.toLowerCase(), str.length - suffix.length) !== -1
  )
}
