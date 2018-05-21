import async from 'async'
import scitran from './scitran'
import crn from './crn'
import userStore from '../user/user.store'
import fileUtils from './files'
import hex from './hex'
import datalad from './datalad'

/**
 * BIDS
 *
 * A library for interactions with the
 * scitran service through BIDS concepts.
 */
export default {
  // Read -----------------------------------------------------------------------------------

  /**
   * Get Datasets
   *
   * Returns a list of datasets including any
   * derived statuses and notes on each. Only returns
   * the top level 'project' container. Takes an optional
   * boolean as second argument to specifiy if request
   * is made with authentication. Defaults to true.
   */
  async getDatasets(
    callback,
    isPublic,
    isSignedOut,
    isAdmin = false,
    metadata = false,
  ) {
    const res = (await datalad
      .getDatasets({
        authenticate: isAdmin || !isPublic,
        snapshot: false,
        metadata: metadata,
        isPublic: isPublic
      })).data
    if (!res) {
      return callback([])
    }
    const projects = res.datasets ? res.datasets : []
    const users = isSignedOut ? null : (await scitran.getUsers()).body
    const stars = (await crn.getStars()).body
    const followers = (await crn.getSubscriptions()).body
    this.usage(null, usage => {
      let resultDict = {}
      for (let project of projects) {
        let dataset = this.formatDataset(
          project,
          null,
          users,
          stars,
          followers,
          usage,
        )
        let datasetId = dataset.hasOwnProperty('original')
          ? dataset.original
          : dataset._id
        let existing = resultDict[datasetId]
        if (
          !existing ||
          (existing.hasOwnProperty('original') &&
            !dataset.hasOwnProperty('original')) ||
          (existing.hasOwnProperty('original') &&
            existing.snapshot_version < project.snapshot_version)
        ) {
          if (isAdmin || project.public || this.userAccess(project)) {
            resultDict[datasetId] = dataset
          }
        }
      }

      let results = []
      for (let key in resultDict) {
        results.push(resultDict[key])
      }
      callback(results)
    })
  },

  /**
   * Get Metadata
   *
   */
  getMetadata(project, callback, options) {
    // determine which metadata files are available
    let metadataFiles = [],
      metadata = {}
    if (project.files) {
      for (let file of project.files) {
        if (file.filename === 'README') {
          metadataFiles.push('README')
        }
        if (file.filename === 'CHANGES') {
          metadataFiles.push('CHANGES')
        }
        if (file.filename === 'dataset_description.json') {
          metadataFiles.push('dataset_description.json')
        }
      }
    }

    // load content of available metadata
    async.each(
      metadataFiles,
      (filename, cb) => {
        datalad
          .getFile(project._id, filename, options)
          .then(file => {
            let contents
            try {
              contents = JSON.parse(file.text)
            } catch (err) {
              contents = file.text
            } finally {
              metadata[filename] = contents
            }
            cb()
          })
          .catch(() => {
            cb()
          })
      },
      () => {
        callback(metadata)
      },
    )
  },

  /**
   * Get Dataset
   *
   * Takes a projectId and returns a full
   * nested BIDS dataset.
   */
  async getDataset(projectId, callback, options) {
    // Users
    let users = null
    try {
      const userRes = await scitran.getUsers()
      users = !options.isPublic && userRes ? userRes.body : null
    } catch (err) {
      // The user request failed
    }

    // Dataset
    try {
      datalad.getDataset(projectId, options, (projectRes) => {
        // if (projectRes.status !== 200) {
        //   return callback(projectRes)
        // }
        const data = projectRes ? projectRes.data : null
        if (data) {
          // get snapshot or draft, depending on results
          let project = !options.snapshot ? data.dataset : data.snapshot
          let draft = !options.snapshot ? project.draft : null
          let tempFiles = draft ? this._formatFiles(draft.files) : this._formatFiles(project.files)
          this.getMetadata(
            project,
            metadata => {
              let dataset = this.formatDataset(
                project,
                metadata['dataset_description.json'],
                users,
              )
              dataset.README = metadata.README
              dataset.CHANGES = metadata.CHANGES
              dataset.children = tempFiles
              dataset.showChildren = true
              dataset.snapshots = project.snapshots
              // get dataset usage stats
              this.usage(projectId, usage => {
                if (usage) {
                  dataset.views = this.views(dataset, usage)
                  dataset.downloads = this.downloads(dataset, usage)
                }
                crn.getDatasetJobs(projectId, options).then(res => {
                  dataset.jobs = res.body
                  return callback(dataset)
                })
                .catch(err => {
                  // console.log('error getting jobs:', err)
                  return callback(dataset, err)
                })
              })
              
            },
            options,
          )
        }
      })
    } catch (err) {
      callback(err)
    }
  },

  /**
   * Format Files
   *
   * Takes a list of files from a dataset and generates
   * the file tree using file paths.
   */
  _formatFiles(files) {
    let fileList = []
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        let file = files[i]

        if (!file.tags || file.tags.indexOf('attachment') == -1) {
          fileList[i] = {
            name: file.filename.replace(/%2F/g, '/').replace(/%20/g, ' '),
            webkitRelativePath: file.filename
              .replace(/%2F/g, '/')
              .replace(/%20/g, ' '),
            size: file.size,
          }
        }
      }
    }
    let fileTree = fileUtils.generateTree(fileList)
    return fileTree
  },

  // Update ---------------------------------------------------------------------------------

  /**
   * Add Permission
   *
   * Takes a projectId and a permission object and
   * adds the permission object if the user doesn't
   * already exist in the project.
   */
  addPermission(projectId, permission) {
    return crn.addPermission('projects', projectId, permission)
  },

  /**
   * Remove Permission
   *
   * Takes a projectId and a userId and removes
   * the user if they were a member of the project.
   */
  removePermission(projectId, userId) {
    return scitran.removePermission('projects', projectId, userId)
  },

  // Delete ---------------------------------------------------------------------------------

  /**
   * Delete Dataset
   *
   * Takes a projectId and delete the project
   * after recursing and removing all sub
   * containers.
   */
  deleteDataset(projectId, options) {
    options.query = { purge: true }
    return scitran.deleteContainer('projects', projectId, options)
  },

  // Dataset Format Helpers -----------------------------------------------------------------

  /**
   * Encode ID
   */
  encodeId(id, version) {
    if (version) {
      id = this.decodeId(id)
      version = this.decodeId(version)
      if (version.length <= 5) {
        let snapshotNumber = this.formatVersionNumber(version)
        let snapshotId = this.encodeId(id.slice(2) + '-' + snapshotNumber)
        return snapshotId
      } else {
        return version
      }
    } else if (/ds\d{6}/.test(id)) {
      return hex.fromASCII('    ' + id)
    } else if (/\d{6}-\d{5}/.test(id)) {
      return hex.fromASCII(id)
    } else {
      return id
    }
  },

  /**
   * Decode ID
   */
  decodeId(id) {
    if (id) {
      let decodedId = hex.toASCII(id)
      if (/\s{4}ds\d{6}/.test(decodedId)) {
        return decodedId.slice(4)
      } else if (/\d{6}-\d{5}/.test(decodedId)) {
        return decodedId.slice(7)
      }
    }
    return id
  },

  /**
   * Get Five Digit Version Number
   */
  formatVersionNumber(version) {
    if (version) {
      return ('00000' + Number(version)).substr(-5, 5)
    }
  },

  /**
   * User
   *
   * Takes a dataset and users list and returns the
   * user object of the uploader.
   */
  user(dataset, users) {
    if (users) {
      for (let user of users) {
        if (user._id === dataset.group) {
          return user
        }
      }
    } else {
      return null
    }
  },

  /**
   * Stars
   *
   * Takes a dataset and stars list and returns the
   * count of stars associated with that dataset.
   */
  stars(dataset, stars) {
    if (stars) {
      let datasetId = dataset.original ? dataset.original : dataset._id
      let associatedStars = stars.filter(star => {
        return star.datasetId === datasetId
      })
      if (associatedStars.length) {
        return associatedStars
      } else {
        return []
      }
    } else {
      return []
    }
  },

  /**
   * Followers
   *
   * Takes a dataset and followers array and returns the count of the array associated with that specific dataset.
   */

  followers(dataset, followers) {
    if (followers) {
      let datasetId = dataset.original ? dataset.original : dataset._id
      let subscriptions = followers.filter(follower => {
        return follower.datasetId === datasetId
      })
      return subscriptions
    } else {
      return []
    }
  },

  /**
   * Downloads
   *
   * Takes a dataset and usage array and returns the download count of the dataset
   */
  downloads(dataset, usage) {
    if (usage) {
      let datasetId = dataset._id
      let matches = usage.filter(entry => {
        return entry._id == datasetId
      })
      const downloads = matches.length ? '' + matches[0].downloads : '0'
      return downloads
    } else {
      return '0'
    }
  },

  /**
   * Views
   *
   * Takes a dataset and usage array and returns the view count of the dataset
   */
  views(dataset, usage) {
    if (usage) {
      let datasetId = dataset._id
      let matches = usage.filter(entry => {
        return entry._id == datasetId
      })
      const views = matches.length ? '' + matches[0].views : '0'
      return views
    } else {
      return '0'
    }
  },

  /**
   * Format Files
   *
   * Sorts files alphabetically and adds parentId
   * and container properties.
   */
  formatFiles(items, parentId, parentContainer) {
    items = items ? items : []
    items.sort((a, b) => {
      let aName = a.name.toLowerCase()
      let bName = b.name.toLowerCase()
      if (aName < bName) {
        return -1
      } else if (aName > bName) {
        return 1
      } else {
        return 0
      }
    })
    for (let item of items) {
      item.parentId = parentId
      item.parentContainer = parentContainer
    }
    return items
  },

  /**
   * Format Dataset
   *
   * Takes a scitran project and returns
   * a formatted top level container of a
   * BIDS dataset.
   */
  formatDataset(project, description, users, stars, followers, usage) {
    let files = [],
      attachments = []
    if (project.files) {
      for (let file of project.files) {
        if (file.tags && file.tags.indexOf('attachment') > -1) {
          attachments.push(file)
        } else {
          files.push(file)
        }
      }
    }

    let dataset = {
      /** same as original **/
      _id: this.encodeId(project._id),
      linkID: this.decodeId(project._id),
      label: project.label,
      group: project.uploader ? project.uploader.id : null,
      created: project.created,
      modified: project.draft ? project.draft.modified : null,
      permissions: project.permissions,
      public: !!project.public,
      downloads: project.downloads,
      views: project.views,

      /** modified for BIDS **/
      validation:
        project.metadata && project.metadata.validation
          ? project.metadata.validation
          : { errors: [], warnings: [] },
      tags: project.tags || [],
      type: 'folder',
      children: files,
      description: this.formatDescription(project.metadata, description),
      attachments: attachments,
      userCreated: this.userCreated(project),
      access: this.userAccess(project),
      summary:
        project.metadata && project.metadata.summary
          ? project.metadata.summary
          : null,
    }
    ;(dataset.status = this.formatStatus(project, dataset.access)),
      (dataset.authors = dataset.description.Authors)
    dataset.referencesAndLinks = dataset.description.ReferencesAndLinks

    dataset.user = this.user(dataset, users)
    if (project.original) {
      dataset.original = project.original
      dataset.linkOriginal = this.decodeId(project.original)
    }

    if (project.snapshot_version) {
      dataset.snapshot_version = project.snapshot_version
      if (!dataset.description.DatasetDOI) {
        this.getDoi(project._id, doi => {
          dataset.description.DatasetDOI = doi
        })
      }
    }
    dataset.stars = this.stars(dataset, stars)
    dataset.starCount = dataset.stars ? '' + dataset.stars.length : '0'
    dataset.followersList = this.followers(dataset, followers)
    dataset.downloads = this.downloads(dataset, usage)
    dataset.views = this.views(dataset, usage)
    dataset.followers = '' + dataset.followersList.length
    return dataset
  },

  /**
   * formatDescription
   *
   */
  formatDescription(metadata, description) {
    let defaultDescription = {
      Name: '',
      License: '',
      Authors: [],
      Acknowledgements: '',
      HowToAcknowledge: '',
      Funding: '',
      ReferencesAndLinks: [],
      DatasetDOI: '',
    }
    description = description ? description : defaultDescription

    if (metadata && metadata.authors) {
      description.Authors = metadata.authors
    }

    if (metadata && metadata.referencesAndLinks) {
      description.ReferencesAndLinks = metadata.referencesAndLinks
    }

    if (typeof description.ReferencesAndLinks === 'string') {
      description.ReferencesAndLinks = [description.ReferencesAndLinks]
    }

    return description
  },

  /**
   * Format Status
   *
   * Takes a metadata object and returns
   * a dataset status object corresponding
   * to any statuses set in the notes.
   */
  formatStatus(project, userAccess) {
    let tags = project.tags ? project.tags : []
    let currentUser = userStore.data.scitran
    let userId = currentUser ? currentUser._id : null
    let hasRoot = currentUser ? currentUser.root : null
    let permissions = project.permissions ? project.permissions : []
    let permittedUsers = permissions.map(user => {
      return user._id
    })
    let adminOnlyAccess = permittedUsers.indexOf(userId) == -1 && hasRoot

    let status = {
      incomplete: tags.indexOf('incomplete') > -1,
      validating: tags.indexOf('validating') > -1,
      invalid: tags.indexOf('invalid') > -1,
      public: !!project.public,
      hasPublic: tags.indexOf('hasPublic') > -1,
      shared:
        userStore.data.scitran &&
        project.group != userStore.data.scitran._id &&
        !!userAccess &&
        !adminOnlyAccess,
    }
    return status
  },

  /**
   * User Access
   *
   * Takes a project and returns the level of access
   * the current user has with that project.
   */
  userAccess(project) {
    let access = null
    const currentUser = userStore.data.scitran ? userStore.data.scitran : null

    const userId = currentUser ? currentUser._id : null
    if (project) {
      if (project.permissions && project.permissions.length > 0) {
        for (let user of project.permissions) {
          if (userId === user._id) {
            access = user.access
          }
        }
      } else if (project.group === userId) {
        access = 'orphaned'
      }

      if (currentUser && currentUser.root) {
        access = 'admin'
      }
    }
    return access
  },

  /**
   * User Created
   *
   * Takes project and returns boolean representing
   * whether the current user created the project.
   */
  userCreated(project) {
    if (!userStore.data.scitran) {
      return false
    }
    return project.group === userStore.data.scitran._id
  },

  /**
   * Usage
   * Takes a snapshotId and snapshot boolean and
   * callsback view and download counts for snapshots.
   */
  usage(datasetId, callback) {
    crn.getAnalytics(datasetId).then(res => {
      let usage = res ? res.body : null
      return callback(usage)
    })
  },

  /**
   * Doi
   *
   * Takes a dataset id returns the minted doi of the dataset if present
   */
  getDoi(datasetId, callback) {
    crn
      .getDoi(datasetId)
      .then(res => {
        let doi = res && res.body ? res.body.doi : ''
        return callback(doi)
      })
      .catch(() => {
        return callback('')
      })
  },
}
