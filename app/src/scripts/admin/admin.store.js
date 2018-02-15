// dependencies ----------------------------------------------------------------------

import Reflux from 'reflux'
import Actions from './admin.actions.js'
import scitran from '../utils/scitran'
import crn from '../utils/crn'
import batch from '../utils/batch'
import notifications from '../notification/notification.actions'
import datasetActions from '../dataset/dataset.actions'

let UserStore = Reflux.createStore({
  // store setup -----------------------------------------------------------------------

  listenables: Actions,

  init: function() {
    this.setInitialState()
  },

  getInitialState: function() {
    return this.data
  },

  // data ------------------------------------------------------------------------------

  data: {},

  update: function(data, callback) {
    for (let prop in data) {
      this.data[prop] = data[prop]
    }
    this.trigger(this.data)
    if (callback) callback()
  },

  /**
   * Set Initial State
   *
   * Sets the state to the data object defined
   * inside the function. Also takes a diffs object
   * which will set the state to the initial state
   * with any differences passed.
   */
  setInitialState: function(diffs) {
    let data = {
      users: [],
      loadingUsers: true,
      searchInput: '',
      adminFilter: false,
      blacklist: [],
      modals: {
        blacklist: false,
        defineJob: false,
      },
      blacklistForm: {
        _id: '',
        firstname: '',
        lastname: '',
        note: '',
      },
      jobDefinitionForm: {
        name: '',
        jobRoleArn: '',
        containerImage: '',
        hostImage: '',
        command: '',
        vcpus: '1',
        memory: '2000',
        analysisLevels: [],
        analysisLevelOptions: [],
        parameters: [],
        edit: false,
        description: '',
        shortDescription: '',
        acknowledgements: '',
        tags: '',
        support: '',
      },
      blacklistError: '',
      eventLogs: [],
      filteredLogs: [],
      yearOptions: [],
      uploadedLogs: [],
      activityLogs: {
        failed: [],
        succeeded: [],
      },
      monthLogs: {
        failed: [],
        succeeded: [],
      },
      loadingFilters: true,
      resultsPerPage: 30,
      page: 0,
    }
    for (let prop in diffs) {
      data[prop] = diffs[prop]
    }
    this.update(data)
  },

  // Actions ---------------------------------------------------------------------------

  /**
   * Blacklist Submit
   *
   * Parses form for blacklisting a user.
   */
  blacklistSubmit() {
    let blacklistForm = this.data.blacklistForm

    if (!blacklistForm._id) {
      this.update({ blacklistError: 'Email address is required.' })
    } else {
      this.update({ blacklistError: '' })

      // check if blacklisted user is a current user
      let userExists, userIndex
      for (let i = 0; i < this.data.users.length; i++) {
        let user = this.data.users[i]
        if (user._id === blacklistForm._id) {
          userExists = true
          userIndex = i
          break
        }
      }

      if (userExists) {
        this.removeUser(blacklistForm._id, userIndex, () => {
          this.blacklistUser(this.data.blacklistForm)
        })
      } else {
        this.blacklistUser(this.data.blacklistForm)
      }
    }
  },

  /**
   * Search username and email
   */
  searchUser(input) {
    this.filter(input, this.data.adminFilter)
  },

  /**
   * filter admin
   */
  filterAdmin() {
    this.filter(this.data.searchInput, !this.data.adminFilter)
  },

  filter(searchInput, adminFilter) {
    let users = this.data.users

    for (let user of users) {
      user.visible = true
      searchInput = searchInput.toLowerCase()

      let admin = user.root === true,
        lastName = user.lastname,
        firstName = user.firstname,
        userName = firstName + ' ' + lastName,
        userSearchStrings =
          user.email.toLowerCase().includes(searchInput) ||
          userName.toLowerCase().includes(searchInput)

      // search filtering
      if (searchInput.length != 0 && !userSearchStrings) {
        user.visible = false
      }

      // button filtering
      if (!admin && adminFilter) {
        user.visible = false
      }
    }
    this.update({ users, searchInput, adminFilter, loadingUsers: false })
  },

  /**
   * Search through event logs
   */
  searchLogs(input) {
    // If the API is unavailable, there are no logs to search
    let eventLogs = this.data.eventLogs || []
    for (let log of eventLogs) {
      log.visible = true
      input = input.toLowerCase()
      let logKeep =
        log.type.toLowerCase().includes(input) ||
        log.user.toLowerCase().includes(input)

      if (input.length != 0 && !logKeep) {
        log.visible = false
      }
    }

    let filteredLogs = eventLogs.filter(log => {
      return log.visible
    })

    this.update({ eventLogs, filteredLogs })
  },

  // ** Filters Eventlog to smaller logs based on job status *
  // uploading contains all jobs
  filterLogs() {
    let eventLogs = this.data.eventLogs
    let uploadedLogs = []
    if (!eventLogs.length) {
      this.getEventLogs()
      return
    }

    for (let log of eventLogs) {
      if (log.type != 'JOB_STARTED') {
        let eventStatus = log.data.job.status.toLowerCase()

        if (eventStatus === 'failed') {
          uploadedLogs.push(log)
        } else if (eventStatus === 'succeeded') {
          uploadedLogs.push(log)
        }
      }
    }

    this.update({ uploadedLogs }, () => {
      this.filterYearActivity()
    })
  },

  filterYearActivity() {
    let uploaded = this.data.uploadedLogs
    let yearArr = this.data.yearOptions
    let entries = this.data.activityLogs
    // only want this to run if the logs are empty...
    if (
      !this.data.activityLogs.failed.length ||
      !this.data.activityLogs.succeeded.length
    ) {
      for (let job of uploaded) {
        let status = job.data.job.status.toLowerCase()
        const dateTime = new Date(job.date).toString()
        let explode = dateTime.split(' ')
        let year = explode[3]
        if (!entries[status][year]) {
          entries[status][year] = []
        } else if (entries[status][year]) {
          entries[status][year].push({ dateTime: dateTime, log: job })
        }
        if (!yearArr.includes(year)) {
          yearArr.push(year)
        }
      }
      this.update({ entries, yearArr }, () => {
        this._filterMonthActivity()
      })
    }
  },

  _filterMonthActivity() {
    let logs = this.data.activityLogs
    let monthLogs = this.data.monthLogs
    if (!logs) {
      return
    }

    for (let year of this.data.yearArr) {
      Object.keys(logs).map(type => {
        if (logs[type][year]) {
          Object.values(logs[type][year]).map(job => {
            let dateArr = job.dateTime.split(' ')
            let status = job.log.data.job.status.toLowerCase()
            let month = dateArr[1]

            if (!monthLogs[status][year]) {
              monthLogs[status][year] = []
            }

            if (!monthLogs[status][year][month]) {
              monthLogs[status][year][month] = []
              monthLogs[status][year][month].push({
                date: job.dateTime,
                status: status,
              })
            } else {
              monthLogs[status][year][month].push({
                date: job.dateTime,
                status: status,
              })
            }
          })
        }
      })
    }
    this.update({ monthLogs, loadingFilters: false })
  },

  /**
   * Blacklist User
   *
   * Takes a gmail address and a first and last
   * name and adds the user as a blacklisted user.
   */
  blacklistUser(userInfo) {
    crn.blacklistUser(userInfo).then(() => {
      let blacklist = this.data.blacklist
      blacklist.push(userInfo)
      this.update({
        blacklist: blacklist,
        blacklistForm: {
          _id: '',
          firstname: '',
          lastname: '',
          note: '',
        },
        showBlacklistModal: false,
      })
    })
  },

  /**
   * Blacklist Modal
   *
   * Triggers a modal for blacklisting a user.
   * Prefills data if a user object is passed.
   */
  blacklistModal(user, callback) {
    let modals = this.data.modals
    modals.blacklist = true
    this.update({
      modals,
      blacklistError: '',
      blacklistForm: {
        _id: user._id ? user._id : '',
        firstname: user.firstname ? user.firstname : '',
        lastname: user.lastname ? user.lastname : '',
        note: '',
      },
    })
    if (callback && typeof callback === 'function') {
      callback()
    }
  },

  /**
   * Get Users
   *
   * Retrieves a list of all users and saves it to the
   * admin store state.
   */
  getUsers() {
    scitran.getUsers().then(res => {
      this.update({ users: res.body }, () => {
        this.searchUser('')
      })
    })
  },

  /**
   * Get Blacklist
   *
   * Retrieves a list of all blacklisted users and saves
   * it to the admin store state.
   */
  getBlacklist() {
    crn.getBlacklist().then(res => {
      this.update({ blacklist: res.body })
    })
  },

  /**
   * Input Change
   *
   * Handles input change state management for
   * admin form data.
   */
  inputChange(form, name, value) {
    let formData = this.data[form]
    formData[name] = value
    let data = {}
    data[form] = formData
    this.update(data)
  },

  /**
   * Remove User
   *
   * Takes a userId and removes the user.
   */
  removeUser(userId, index, callback) {
    scitran.removeUser(userId).then(() => {
      let users = this.data.users
      users.splice(index, 1)
      this.update({ users })
      if (callback) {
        callback()
      }
    })
  },

  /**
   * Submit Job Definition
   */
  submitJobDefinition() {
    let formData = this.data.jobDefinitionForm
    // Build up the AWS object
    let jobDefinition = {}
    let parameters = {}
    let parametersMetadata = {}

    jobDefinition.jobDefinitionName = formData.name
    // Container is the only supported type by AWS Batch API as of now.
    jobDefinition.type = 'container'

    jobDefinition.containerProperties = {
      image: formData.hostImage,
      command: formData.command.length ? formData.command.split(' ') : [],
      memory: parseInt(formData.memory),
      vcpus: parseInt(formData.vcpus),
      environment: [{ name: 'BIDS_CONTAINER', value: formData.containerImage }],
    }
    // Can split out paramter metadata here I think?
    // Want to post metadata as a separate prop so we can delete before sending to Batch
    if (formData.parameters) {
      for (let param of formData.parameters) {
        parameters[param.label] = param.defaultValue
        parametersMetadata[param.label] = param
        let types = ['radio', 'multi', 'select']
        if (types.includes(param.type) && param.label != 'participant_label') {
          let arrayInput = param.defaultValue.split(' ')
          param.defaultValue = arrayInput.filter(value => value.trim() != ' ')
        } else {
          param.defaultValue = param.defaultValue
        }
      }
    }

    jobDefinition.parameters = parameters
    jobDefinition.parametersMetadata = parametersMetadata
    jobDefinition.analysisLevels = formData.analysisLevels

    jobDefinition.descriptions = {
      description: formData.description,
      shortDescription: formData.shortDescription,
      acknowledgements: formData.acknowledgements,
      support: formData.support,
      tags: formData.tags,
    }

    crn
      .defineJob(jobDefinition)
      .then(() => {
        notifications.createAlert({
          type: 'Success',
          message: 'Job Definition Submission Successful!',
        })

        //toggle modal once response comes bacn from server.
        this.toggleModal('defineJob')

        // TODO - error handling
        datasetActions.loadApps() //this does not seem like the right way to do this.
      })
      .catch(err => {
        // server is returning 400 for invalid inputs for vcpus and memory
        if (err.status === 400) {
          notifications.createAlert({
            type: 'Error',
            message: 'Invalid job definition inputs for vCPUs and/or Memory.',
          })
        } else {
          notifications.createAlert({
            type: 'Error',
            message: 'There was an error submitting job definition.',
          })
        }
      })
  },

  deleteJobDefinition(jobDefinition, callback) {
    let appId = jobDefinition.jobDefinitionName + ':' + jobDefinition.revision
    crn.deleteJobDefinition(appId).then(() => {
      datasetActions.loadApps() //need to reload apps for UI to update with Inactive status on delete
      if (callback) {
        callback()
      }
    })
  },

  /**
   * Setup job definition form for editing
   */
  editJobDefinition(jobDefinition, callback) {
    this.toggleModal('defineJob')
    let jobDefinitionForm = this.data.jobDefinitionForm
    jobDefinitionForm.edit = true
    jobDefinitionForm.name = jobDefinition.jobDefinitionName
    jobDefinitionForm.description =
      jobDefinition.descriptions && jobDefinition.descriptions.description
        ? jobDefinition.descriptions.description
        : ''
    jobDefinitionForm.shortDescription =
      jobDefinition.descriptions && jobDefinition.descriptions.shortDescription
        ? jobDefinition.descriptions.shortDescription
        : ''
    jobDefinitionForm.acknowledgements =
      jobDefinition.descriptions && jobDefinition.descriptions.acknowledgements
        ? jobDefinition.descriptions.acknowledgements
        : ''
    jobDefinitionForm.support =
      jobDefinition.descriptions && jobDefinition.descriptions.support
        ? jobDefinition.descriptions.support
        : ''
    jobDefinitionForm.tags =
      jobDefinition.descriptions && jobDefinition.descriptions.tags
        ? jobDefinition.descriptions.tags
        : ''
    jobDefinitionForm.jobRoleArn = jobDefinition.jobDefinitionArn
    jobDefinitionForm.containerImage = batch.getBidsContainer(jobDefinition)
    jobDefinitionForm.hostImage = jobDefinition.containerProperties.image
    jobDefinitionForm.command = jobDefinition.containerProperties.command.join(
      ' ',
    )
    jobDefinitionForm.vcpus = jobDefinition.containerProperties.vcpus.toString() //form is expecting string
    jobDefinitionForm.memory = jobDefinition.containerProperties.memory.toString() //form is expecting string
    jobDefinitionForm.analysisLevels = jobDefinition.analysisLevels

    let params = []
    if (Object.keys(jobDefinition.parameters).length) {
      Object.keys(jobDefinition.parameters).forEach(key => {
        let paramInputData = {
          label: key,
          defaultValue: jobDefinition.parameters[key],
        }
        if (
          jobDefinition.parametersMetadata &&
          jobDefinition.parametersMetadata[key]
        ) {
          paramInputData.type = jobDefinition.parametersMetadata[key].type
          paramInputData.description =
            jobDefinition.parametersMetadata[key].description
          paramInputData.required = !!jobDefinition.parametersMetadata[key]
            .required
          paramInputData.hidden = !!jobDefinition.parametersMetadata[key].hidden
        }
        params.push(paramInputData)
      })
    }

    jobDefinitionForm.parameters = params

    this.update({ jobDefinitionForm })
    if (callback) {
      callback()
    }
  },

  /**
   * Reset the job definition form
   */
  resetJobDefinitionForm() {
    let jobDefinitionForm = {
      name: '',
      jobRoleArn: '',
      containerImage: '',
      hostImage: '',
      command: '',
      vcpus: '1',
      description: '',
      memory: '2000',
      analysisLevels: [],
      analysisLevelOptions: [],
      parameters: [],
      edit: false,
      shortDescription: '',
      acknowledgements: '',
      tags: '',
      support: '',
    }

    this.update({ jobDefinitionForm })
  },

  /**
   * Toggle Modal
   */
  toggleModal(modalName) {
    let modals = this.data.modals
    let newModalFlag = !modals[modalName]
    modals[modalName] = newModalFlag
    //If we are going from true to false, i.e. hiding modal, we need to reset form values
    if (modalName === 'defineJob' && !newModalFlag) {
      this.resetJobDefinitionForm()
    }
    this.update({ modals })
  },

  /**
   * Toggle Super User
   */
  toggleSuperUser(user, callback) {
    scitran.updateUser(user._id, { root: !user.root }).then(() => {
      let users = this.data.users
      for (let existingUser of users) {
        if (existingUser._id === user._id) {
          user.root = !user.root
        }
      }
      this.update({ users: users })
      if (callback) {
        callback()
      }
    })
  },

  /**
   * Unblacklist User
   */
  unBlacklistUser(userId) {
    crn.unBlacklistUser(userId).then(() => {
      let blacklist = this.data.blacklist
      for (let i = 0; i < blacklist.length; i++) {
        let user = blacklist[i]
        if (user._id === userId) {
          blacklist.splice(i, 1)
          break
        }
      }
      this.update({ blacklist })
    })
  },

  /**
   * Get Event Logs
   */
  getEventLogs() {
    crn.getEventLogs().then(res => {
      let eventLogs = res.body
      this.update({ eventLogs }, () => {
        this.searchLogs('')
        if (eventLogs.length) {
          this.filterLogs()
        }
      })
    })
  },

  /**
   * Switch the page for the event logs view
   */
  setLogsPage(page) {
    this.update({ page })
  },
})

export default UserStore
