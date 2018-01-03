import scitran from '../utils/scitran'
import crn from '../utils/crn'
import uploads from '../utils/upload'
import fileUtils from '../utils/files'
import config from '../../../config'
import diff from './diff'

export default {
  // progress --------------------------------------------------------------------------

  /**
   * Current Project Id
   */
  currentProjectId: null,

  /**
   * Current Files
   *
   * An array of file names that are currently being uploaded.
   */
  currentFiles: [],

  /**
   * Total
   */
  total: 0,

  /**
   * Completed
   */
  completed: 0,

  // upload ----------------------------------------------------------------------------

  /**
   * Upload
   *
   * Takes an entire bids file list and uploads all the files.
   * Additionally takes a progress callback that gets
   * updated at the start and end of every file or
   * folder upload request and an error callback.
   */
  upload(userId, datasetName, fileList, metadata, progress, error) {
    this.total = fileList.length + 1
    this.completed = 0
    this.error = error
    this.currentProjectId = null
    this.progressStart = filename => {
      this.currentFiles.push(filename)
      progress({
        status: 'uploading',
        total: this.total,
        completed: this.completed,
        currentFiles: this.currentFiles,
      })
    }
    this.progressEnd = filename => {
      let index = this.currentFiles.indexOf(filename)
      this.currentFiles.splice(index, 1)
      this.completed++
      progress(
        {
          status: 'uploading',
          total: this.total,
          completed: this.completed,
          currentFiles: this.currentFiles,
        },
        this.currentProjectId,
      )
    }
    let existingProject = null
    scitran.getProjects({ authenticate: true }, projects => {
      for (let project of projects) {
        if (project.label === datasetName && project.group === userId) {
          project.children = project.files
          existingProject = project
          break
        }
      }

      if (existingProject) {
        // Since files are no longer included with getProjects
        // we have to make a second request
        scitran.getProject(
          existingProject._id,
          response => {
            const existingProject = response.body
            this.currentProjectId = existingProject._id
            diff.datasets(
              fileList,
              existingProject.files,
              (newFiles, completedFiles) => {
                this.completed = this.completed + completedFiles.length + 1
                progress({
                  status: 'calculating',
                  total: this.total,
                  completed: this.completed,
                  currentFiles: this.currentFiles,
                })
                this.uploadFiles(
                  datasetName,
                  newFiles,
                  this.currentProjectId,
                  metadata,
                )
              },
            )
          },
          { query: { metadata: true } },
        )
      } else {
        this.createContainer(
          crn.createProject,
          [userId, datasetName],
          (err, res) => {
            let projectId = res.body._id
            scitran.addTag('projects', projectId, 'incomplete', () => {
              this.uploadFiles(datasetName, fileList, projectId, metadata)
            })
          },
        )
      }
    })
  },

  /**
   * Upload Files
   *
   */
  uploadFiles(datasetName, files, projectId, metadata) {
    this.currentProjectId = projectId
    for (let file of files) {
      if (config.upload.blacklist.indexOf(file.name) > -1) {
        // ignore blacklisted files
        this.progressStart(file.name)
        this.progressEnd(file.name)
        continue
      } else if (file.name === 'dataset_description.json') {
        this.uploadMetadata(datasetName, projectId, metadata, file)
      } else {
        this.uploadFile('projects', projectId, file)
      }
    }
  },

  /**
   * Upload Metadata
   */
  uploadMetadata(datasetName, projectId, metadata, descriptionFile) {
    fileUtils.read(descriptionFile, contents => {
      let description = JSON.parse(contents)
      description.Name = datasetName
      metadata.authors = []
      if (description.hasOwnProperty('Authors')) {
        for (let i = 0; i < description.Authors.length; i++) {
          let author = description.Authors[i]
          metadata.authors.push({ name: author, ORCIDID: '' })
        }
      }
      scitran.updateProject(projectId, { metadata }, () => {
        let file = new File(
          [JSON.stringify(description)],
          'dataset_description.json',
          { type: 'application/json' },
        )
        file.relativePath = file.name
        this.uploadFile('projects', projectId, file)
      })
    })
  },

  // queue container and file requests ------------------------------------------------------

  createContainer(func, args, callback) {
    uploads.add({
      func,
      args,
      callback,
      progressStart: this.progressStart,
      progressEnd: this.progressEnd,
      error: this.error,
    })
  },

  /**
   * Upload File
   *
   * Pushes upload details into an upload queue.
   */
  uploadFile(level, id, file) {
    let url = config.scitran.url + level + '/' + id + '/files'
    uploads.add({
      url: url,
      file: file,
      progressStart: this.progressStart,
      progressEnd: this.progressEnd,
      error: this.error,
    })
  },
}
