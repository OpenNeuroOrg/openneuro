import request from './request'
import config from '../config'
import fs from 'fs'
import crypto from 'crypto'
import files from './files'
import userCache from '../libs/cache/userCache.js'

/**
 * Scitran
 *
 * A library for interactions with the
 * scitran API.
 */
export default {
  /**
     * Verify User
     *
     * Checks if the currently logged in users
     * in in the scitran system and returns a
     * user object.
     */
  verifyUser(req, res) {
    request.getProxy(
      config.scitran.url + 'users/self',
      { headers: req.headers, status: 200 },
      res,
    )
  },

  /**
     * Is Super User
     */
  isSuperUser(accessToken, callback) {
    request.get(
      config.scitran.url + 'users/self',
      {
        headers: {
          Authorization: accessToken,
        },
      },
      (err, res) => {
        callback(!!res.body.wheel)
      },
    )
  },

  /**
     * Get User
     */
  getUser(userId, callback) {
    request.getCache(
      config.scitran.url + 'users/' + userId,
      userCache,
      { body: { userId: userId } },
      callback,
    )
  },

  /**
     * Get User by Token
     */
  getUserByToken(accessToken, callback) {
    request.get(
      config.scitran.url + 'users/self',
      {
        headers: {
          Authorization: accessToken,
        },
      },
      callback,
    )
  },

  /**
     * Create User
     */
  createUser(user, callback) {
    request.postCache(
      config.scitran.url + 'users',
      userCache,
      { body: user },
      () => {
        this.createGroup(user._id, user._id, callback)
      },
    )
  },

  /**
     * Create Group
     *
     * Takes a groupName and a userId and
     * creates a group with that user as the
     * admin.
     */
  createGroup(groupName, userId, callback) {
    let body = {
      _id: groupName,
      name: groupName,
    }
    request.post(config.scitran.url + 'groups', { body: body }, () => {
      this.addRole(
        'groups',
        groupName,
        { _id: groupName, access: 'admin', site: 'local' },
        callback,
      )
    })
  },

  /**
     * Get Project
     *
     */
  getProject(projectId, callback, options) {
    let modifier = options && options.snapshot ? 'snapshots/' : ''
    request.get(
      config.scitran.url + modifier + 'projects/' + projectId,
      {},
      callback,
    )
  },

  /**
   * Get File
   *
   */
  getFile(level, id, filename, options, callback) {
    request.get(
      config.scitran.url + level + '/' + id + '/files/' + filename,
      options,
      callback,
    )
  },

  /**
     * Get Project Snapshots
     */
  getProjectSnapshots(projectId, callback) {
    request.get(
      config.scitran.url + 'projects/' + projectId + '/snapshots',
      {
        query: { public: true },
      },
      callback,
    )
  },

  /**
     * Update Project
     *
     */
  updateProject(projectId, body, callback) {
    request.put(
      config.scitran.url + 'projects/' + projectId,
      { body },
      (err, res) => {
        callback(err, res)
      },
    )
  },

  /**
     * Add Tag
     */
  addTag(containerType, containerId, tag, callback) {
    request.post(
      config.scitran.url + containerType + '/' + containerId + '/tags',
      {
        body: { value: tag },
      },
      callback,
    )
  },

  /**
     * Remove Tag
     */
  removeTag(containerType, containerId, tag, callback) {
    request.del(
      config.scitran.url + containerType + '/' + containerId + '/tags/' + tag,
      {},
      callback,
    )
  },

  /**
     * Add Role
     */
  addRole(container, id, role, callback) {
    request.post(
      config.scitran.url + container + '/' + id + '/roles',
      { body: role },
      callback,
    )
  },

  /**
     * Download Symlink Dataset
     *
     * Downloads a tar archive of symlinks to reconstruct a
     * BIDS dataset. Stores it under a hash id in a local
     * file store and updates all symlinks to point to the
     * correct files in scitran's file store.
     */
  downloadSymlinkDataset(datasetId, callback, options) {
    let modifier = options && options.snapshot ? 'snapshots/' : ''
    request.post(
      config.scitran.url + modifier + 'download',
      {
        query: { format: 'bids', query: true },
        body: {
          nodes: [
            {
              _id: datasetId,
              level: 'project',
            },
          ],
          optional: false,
        },
      },
      (err, res) => {
        if (!res.body.ticket) {
          callback({ status: 404, message: 'Dataset not found.' })
          return
        }
        let ticket = res.body.ticket
        request.get(
          config.scitran.url + 'download',
          { query: { symlinks: true, ticket: ticket } },
          (err2, res2) => {
            if (!err2) {
              let hash = crypto
                .createHash('md5')
                .update(res2.body)
                .digest('hex')
              fs.readdir(
                config.location + '/persistent/datasets/',
                (err3, contents) => {
                  if (contents && contents.indexOf(hash) > -1) {
                    callback(err, hash)
                  } else {
                    files.saveSymlinks(hash, res2.body, () => {
                      callback(err, hash)
                    })
                  }
                },
              )
            }
          },
        )
      },
    )
  },
}
