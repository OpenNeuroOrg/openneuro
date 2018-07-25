import request from './request'
import config from '../../../config'

/**
 * Scitran
 *
 * A library for interactions with the
 * scitran service.
 */
export default {
  // User Management ------------------------------------------------------------------------

  /**
   * Get Users
   *
   * Gets a list of all users
   */
  getUsers() {
    return request.get(config.scitran.url + 'users', {})
  },

  /**
   * Verify User
   *
   * Checks if the currently logged in users
   * in in the scitran system and returns a
   * user object.
   */
  verifyUser() {
    return request.get(config.scitran.url + 'users/self', {})
  },

  /**
   * Add User
   *
   * Takes an email and name
   * add adds the user.
   */
  addUser(userData) {
    return request
      .post(config.scitran.url + 'users', { body: userData })
      .then(() => {
        return this.createGroup(userData._id, userData._id)
      })
  },

  /**
   * Update User
   */
  updateUser(userId, userData) {
    return request.put(config.scitran.url + 'users/' + userId, {
      body: userData,
    })
  },

  /**
   * Remove User
   *
   * Takes a userId and removes the user.
   */
  removeUser(userId) {
    return request.del(config.scitran.url + 'users/' + userId, {})
  },

  // Create ---------------------------------------------------------------------------------

  /**
   * Create Group
   *
   * Takes a groupName and a userId and
   * creates a group with that user as the
   * admin.
   */
  createGroup(groupName, userId) {
    let body = {
      _id: groupName,
      roles: [{ access: 'admin', _id: userId }],
    }
    return request.post(config.scitran.url + 'groups', { body: body })
  },

  /**
   * Create Project
   *
   * Takes a request body and
   * generates a request to make a project in scitran.
   */
  createProject(group, label) {
    return request.post(config.scitran.url + 'projects', {
      body: { group, label },
    })
  },

  /**
   * Create Subject
   *
   */
  createSubject(projectId, subjectName) {
    return request.post(config.scitran.url + 'sessions', {
      body: {
        project: projectId,
        label: subjectName,
        subject: {
          code: 'subject',
        },
      },
    })
  },

  /**
   * Create Session
   *
   */
  createSession(projectId, subjectId, sessionName) {
    return request.post(config.scitran.url + 'sessions', {
      body: {
        project: projectId,
        label: sessionName,
        subject: {
          code: subjectId,
        },
      },
    })
  },

  /**
   * Create Modality
   *
   */
  createModality(sessionId, modalityName) {
    return request.post(config.scitran.url + 'acquisitions', {
      body: {
        session: sessionId,
        label: modalityName,
      },
    })
  },

  /**
   * Add Tag
   */
  addTag(containerType, containerId, tag) {
    return request.post(
      config.scitran.url + containerType + '/' + containerId + '/tags',
      {
        body: { value: tag },
      },
    )
  },

  /**
   * Add Permission
   */
  addPermission(container, id, permission) {
    permission.site = 'local'
    return request.post(
      config.scitran.url + container + '/' + id + '/permissions',
      { body: permission },
    )
  },

  // Read -----------------------------------------------------------------------------------

  /**
   * Get Projects
   *
   */
  getProjects(options) {
    options.auth = options.hasOwnProperty('authenticate')
      ? options.authenticate
      : true
    options.query = { metadata: !!options.metadata }
    return request.get(config.scitran.url + 'projects', options)
  },

  /**
   * Get Project
   *
   */
  getProject(projectId, options) {
    return request.get(config.scitran.url + 'projects/' + projectId, options)
  },

  /**
   * Get Sessions
   *
   */
  getSessions(projectId, options) {
    options.query = { public: true }
    return request.get(
      config.scitran.url + 'projects/' + projectId + '/sessions',
      options,
    )
  },

  /**
   * Get Session
   *
   */
  getSession(sessionId, options) {
    return request.get(config.scitran.url + 'sessions/' + sessionId, options)
  },

  /**
   * Get Project Acquisitions
   */
  getProjectAcquisitions(projectId, options) {
    return request.get(
      config.scitran.url + 'projects/' + projectId + '/acquisitions',
      options,
    )
  },

  /**
   * Get Acquisitions
   *
   */
  getAcquisitions(sessionId, options) {
    options.query = { public: true }
    return request.get(
      config.scitran.url + 'sessions/' + sessionId + '/acquisitions',
      options,
    )
  },

  /**
   * Get Acquisition
   *
   */
  getAcquisition(acquisitionId, options) {
    return request.get(
      config.scitran.url + 'acquisitions/' + acquisitionId,
      options,
    )
  },

  /**
   * Get File
   *
   */
  getFile(level, id, filename, options) {
    return request.get(
      config.scitran.url + level + '/' + id + '/files/' + filename,
      options,
    )
  },

  /**
   * Get Download Ticket
   *
   */
  getDownloadTicket(level, id, filename, options) {
    options.query = { ticket: '' }
    return request.get(
      config.scitran.url + level + '/' + id + '/files/' + filename,
      options,
    )
  },

  /**
   * Get BIDS Download Ticket
   *
   */
  getBIDSDownloadTicket(projectId, options) {
    options.query = { format: 'bids' }
    options.body = {
      nodes: [{ _id: projectId, level: 'project' }],
      optional: false,
    }
    return request.post(config.scitran.url + 'download', options)
  },

  // Delete ---------------------------------------------------------------------------------

  /**
   * Delete Container
   *
   */
  deleteContainer(type, id, options) {
    options = options ? options : {}
    return request.del(
      config.scitran.url + type + '/' + id + '?purge=true',
      options,
    )
  },

  /**
   * Delete File
   *
   */
  deleteFile(level, containerId, filename) {
    return request.del(
      config.scitran.url + level + '/' + containerId + '/files/' + filename,
      {},
    )
  },

  /**
   * Remove Tag
   */
  removeTag(containerType, containerId, tag) {
    return request.del(
      config.scitran.url + containerType + '/' + containerId + '/tags/' + tag,
      {},
    )
  },

  /**
   * Remove Permission
   */
  removePermission(container, id, userId) {
    return request.del(
      config.scitran.url +
        container +
        '/' +
        id +
        '/permissions/local/' +
        userId,
      {},
    )
  },

  // Update ---------------------------------------------------------------------------------

  /**
   * Update Project
   *
   */
  updateProject(projectId, body) {
    return request.put(config.scitran.url + 'projects/' + projectId, { body })
  },

  /**
   * Update File
   *
   */
  updateFile(level, id, file) {
    return request.upload(config.scitran.url + level + '/' + id + '/files', {
      fields: {
        tags: '[]',
        file: file,
        name: file.hasOwnProperty('modifiedName')
          ? file.modifiedName
          : file.name,
      },
      query: { force: true },
    })
  },

  /**
   * Update File From String
   *
   */
  updateFileFromString(level, id, filename, value, type, tags, callback) {
    let file = new File([value], filename, { type: type })
    return request.upload(
      config.scitran.url + level + '/' + id + '/files',
      {
        fields: {
          tags: tags ? JSON.stringify(tags) : '[]',
          file: file,
          name: filename,
        },
        query: { force: true },
      },
      callback,
    )
  },

  // Snapshots ------------------------------------------------------------------------------

  createSnapshot(projectId) {
    return request.post(config.scitran.url + 'snapshots', {
      query: { project: projectId },
    })
  },

  getProjectSnapshots(projectId) {
    return request.get(
      config.scitran.url + 'projects/' + projectId + '/snapshots',
      {
        query: { public: true },
      },
    )
  },

  updateSnapshotPublic(projectId, value) {
    return request.put(
      config.scitran.url + 'snapshots/projects/' + projectId + '/public',
      {
        body: { value },
      },
    )
  },
}
