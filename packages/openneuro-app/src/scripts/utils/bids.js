import async from 'async'
import crn from './crn'
import fileUtils from './files'
import hex from './hex'
import datalad from './datalad'
import config from '../../../config.js'
import { getProfile } from '../authentication/profile.js'

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
    const res = (await datalad.getDatasets({
      authenticate: isAdmin || !isPublic,
      snapshot: false,
      metadata: metadata,
      isPublic: isPublic,
    })).data
    if (!res) {
      return callback([])
    }
    const projects = res.datasets ? res.datasets : []
    const users = isSignedOut ? null : await datalad.getUsers()
    const stars = (await crn.getStars()).body
    const followers = (await crn.getSubscriptions()).body
    let resultDict = {}
    for (let project of projects) {
      project.summary = project.draft ? project.draft.summary : null
      let dataset = this.formatDataset(project, null, users, stars, followers)
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
            return cb()
          })
          .catch(() => {
            return cb()
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
      const userRes = await datalad.getUsers()
      users = !options.isPublic && userRes ? userRes : null
    } catch (err) {
      // The user request failed
    }

    // Dataset
    try {
      datalad
        .getDataset(projectId)
        .then(async projectRes => {
          const data = projectRes ? projectRes.data : null
          if (data) {
            // get snapshot or draft, depending on results
            let project = data.dataset
            let draft = project ? project.draft : null
            let snapshotQuery = options.snapshot
              ? (await datalad.getSnapshot(projectId, options)).data
              : null
            let snapshot = snapshotQuery ? snapshotQuery.snapshot : null
            let draftFiles = draft && draft.files ? draft.files : []
            let snapshotFiles = snapshot ? snapshot.files : []
            let tempFiles = !snapshot
              ? this._formatFiles(draftFiles)
              : this._formatFiles(snapshotFiles)
            project.snapshot_version = snapshot ? snapshot.tag : null
            project.analytics = snapshot
              ? snapshot.analytics
              : project.analytics

            // get draft or snapshot summary
            let draftSummary = draft ? draft.summary : null
            let snapshotSummary = snapshot ? snapshot.summary : null
            project.summary = snapshot ? snapshotSummary : draftSummary

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
                if (config.analysis.enabled) {
                  crn
                    .getDatasetJobs(projectId, options)
                    .then(res => {
                      dataset.jobs = res.body
                      return callback(dataset)
                    })
                    .catch(err => {
                      return callback(dataset, err)
                    })
                } else {
                  dataset.jobs = []
                  return callback(dataset)
                }
              },
              options,
            )
          }
        })
        .catch(() => {
          // Shim in 403 error
          callback({ status: 403 })
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
        if (user.id === dataset.group) {
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
        return star.datasetId === this.decodeId(datasetId)
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
        return follower.datasetId === this.decodeId(datasetId)
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
  downloads(dataset) {
    return dataset.analytics && dataset.analytics.downloads
      ? '' + dataset.analytics.downloads
      : '0'
  },

  /**
   * Views
   *
   * Takes a dataset and usage array and returns the view count of the dataset
   */
  views(dataset) {
    return dataset.analytics && dataset.analytics.views
      ? '' + dataset.analytics.views
      : '0'
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
  formatDataset(project, description, users, stars, followers) {
    let files = project.files

    let dataset = {
      /** same as original **/
      _id: this.encodeId(project._id),
      linkID: this.decodeId(project._id),
      label: project.draft.description ? project.draft.description.Name : null,
      group: project.uploader ? project.uploader.id : null,
      created: project.created,
      modified:
        project.draft && project.draft.modified ? project.draft.modified : null,
      permissions: project.permissions,
      public: !!project.public,
      downloads: this.downloads(project),
      views: this.views(project),

      /** modified for BIDS **/
      validation:
        project.metadata && project.metadata.validation
          ? project.metadata.validation
          : { errors: [], warnings: [] },
      tags: project.tags || [],
      type: 'folder',
      children: files,
      description: this.formatDescription(project.metadata, description),
      userCreated: this.userCreated(project),
      access: this.userAccess(project),
      summary: project.summary,
    }
    dataset.status = this.formatStatus(project, dataset.access)
    dataset.authors = dataset.description.Authors
    dataset.referencesAndLinks = dataset.description.ReferencesAndLinks

    dataset.user = this.user(dataset, users)
    if (project.original) {
      dataset.original = project.original
      dataset.linkOriginal = this.decodeId(project.original)
    }

    if (project.snapshot_version) {
      dataset.snapshot_version = project.snapshot_version
      if (!dataset.description.DatasetDOI) {
        this.getDoi(project.linkId, project.snapshot_version, doi => {
          dataset.description.DatasetDOI = doi
        })
      }
    }
    dataset.stars = this.stars(dataset, stars)
    dataset.starCount = dataset.stars ? '' + dataset.stars.length : '0'
    dataset.followersList = this.followers(dataset, followers)
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
    description = Object.assign(defaultDescription, description)

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
    let validationIssues =
      project.draft && project.draft.issues ? project.draft.issues : []
    let tags = project.tags ? project.tags : []
    let currentUser = getProfile()
    let uploader = project.uploader ? project.uploader.id : null
    let userId = currentUser ? currentUser.id : null
    let hasRoot = currentUser ? currentUser.admin : null
    let permissions = project.permissions ? project.permissions : []
    let permittedUsers = permissions.map(user => {
      return user.userId
    })
    let adminOnlyAccess = permittedUsers.indexOf(userId) == -1 && hasRoot

    let status = {
      incomplete: tags.indexOf('incomplete') > -1 || project.draft.partial,
      validating: tags.indexOf('validating') > -1,
      invalid: !!validationIssues.find(i => i.severity == 'error'), // dataset is invalid if there are any issues with 'error' level severity
      public: !!project.public,
      hasPublic: tags.indexOf('hasPublic') > -1,
      shared:
        currentUser &&
        uploader !== currentUser.sub &&
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
    const currentUser = getProfile()

    const userId = currentUser ? currentUser.sub : null
    if (project) {
      if (project.permissions && project.permissions.length > 0) {
        for (let user of project.permissions) {
          if (userId === user.userId) {
            access = user.access
          }
        }
      }

      if (currentUser && currentUser.admin) {
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
    const userProfile = getProfile()
    if (userProfile === null) {
      return false
    }
    return project.uploader ? project.uploader.id === userProfile.sub : false
  },

  /**
   * Doi
   *
   * Takes a dataset id returns the minted doi of the dataset if present
   */
  getDoi(datasetId, snapshotId, callback) {
    crn
      .getDoi(datasetId, snapshotId)
      .then(res => {
        let doi = res && res.body ? res.body.doi : ''
        return callback(doi)
      })
      .catch(() => {
        return callback('')
      })
  },
}
