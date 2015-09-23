import request from './request';
import async   from 'async';
import config  from '../config';

/**
 * Scitran
 *
 * A library for interactions with the
 * scitran service.
 */
export default  {

// User Management ------------------------------------------------------------------------

    /**
     * Get Users
     *
     * Gets a list of all users
     */
    getUsers (callback) {
        request.get(config.scitran.url + 'users', {}, callback);
    },
    
    /**
     * Verify User
     *
     * Checks if the currently logged in users
     * in in the scitran system and returns a
     * user object.
     */
    verifyUser (callback) {
        request.get(config.scitran.url + 'users/self', {}, callback);
    },

    /**
     * Add User
     *
     * Takes an email, first name, and last name
     * add adds the user.
     */
    addUser (userData, callback) {
        let self = this;
        request.post(config.scitran.url + 'users', {body: userData}, (err, res) => {
            self.createGroup(userData._id, userData._id, callback);
        });
    },

    /**
     * Remove User
     *
     * Takes a userId and removes the user.
     */
     removeUser (userId, callback) {
        request.del(config.scitran.url + 'users/' + userId, (err, res) => {
            request.del(config.scitran.url + 'groups/' + userId, (err, res) => {
                callback(err, res);
            });
        });
     },

// Create ---------------------------------------------------------------------------------

    /**
     * Create Group
     *
     * Takes a groupName and a userId and
     * creates a group with that user as the
     * admin.
     */
    createGroup (groupName, userId, callback) {
        let body = {
            _id: groupName,
            roles: [{access: 'admin', _id: userId}]
        };
        request.post(config.scitran.url + 'groups', {body: body}, callback);
    },

    /**
     * Create Project
     *
     * Takes a group name and a project name and
     * generates a request to make a project in scitran.
     */
    createProject (groupName, body, callback) {
        request.post(config.scitran.url + 'groups/' + groupName + '/projects', {body: body}, callback);
    },

    /**
     * Create Subject
     *
     */
    createSubject (projectId, subjectName, callback) {
        let body = {label: subjectName, subject_code: 'subject'};
        request.post(config.scitran.url + 'projects/' + projectId + '/sessions', {body: body}, callback);
    },

    /**
     * Create Session
     *
     */
    createSession (projectId, subjectId, sessionName, callback) {
        let body = {label: sessionName, subject_code: subjectId};
        request.post(config.scitran.url + 'projects/' + projectId + '/sessions', {body: body}, callback);
    },

    /**
     * Create Modality
     *
     */
    createModality (sessionId, modalityName, callback) {
        let body = {label: modalityName, datatype: 'modality'};
        request.post(config.scitran.url + 'sessions/' + sessionId + '/acquisitions', {body: body}, callback);
    },

// Read -----------------------------------------------------------------------------------

    /**
     * Get Projects
     *
     */
    getProjects (authenticate, callback) {
        request.get(config.scitran.url + 'projects', {auth: authenticate}, (err, res) => {
            callback(res.body);
        });
    },

    /**
     * Get Project
     *
     */
    getProject (projectId, callback) {
        request.get(config.scitran.url + 'projects/' + projectId, {}, (err, res) => {
            callback(res);
        });
    },

    /**
     * Get Sessions
     *
     */
    getSessions (projectId, callback) {
        request.get(config.scitran.url + 'projects/' + projectId + '/sessions', {}, (err, res) => {
            callback(res.body);
        });
    },

    /**
     * Get Session
     *
     */
    getSession (sessionId, callback) {
        request.get(config.scitran.url + 'sessions/' + sessionId, {}, (err, res) => {
            callback(res.body);
        });
    },

    /**
     * Get Acquisitions
     *
     */
    getAcquisitions (sessionId, callback) {
        request.get(config.scitran.url + 'sessions/' + sessionId + '/acquisitions', {}, (err, res) => {
            callback(res.body);
        });
    },

    /**
     * Get Acquisition
     *
     */
    getAcquisition (acquisitionId, callback) {
        request.get(config.scitran.url + 'acquisitions/' + acquisitionId, {}, (err, res) => {
            callback(res.body);
        });
    },

    /**
     * Get Download Ticket
     *
     */
    getDownloadTicket (level, id, filename, callback) {
        request.get(config.scitran.url + level + '/' + id + '/file/' + filename, {
            query: {ticket: ''}
        }, callback);
    },

// Delete ---------------------------------------------------------------------------------

    /**
     * Delete Container
     *
     */
    deleteContainer (type, id, callback) {
        request.del(config.scitran.url + type + '/' + id, (err, res) => {
            callback();
        });
    },

    /**
     * Delete File
     *
     */
    deleteFile (level, containerId, filename, callback) {
        request.del(config.scitran.url + level + '/' + containerId + '/file/' + filename, callback);
    },

// Update ---------------------------------------------------------------------------------

    /**
     * Update Project
     *
     */
    updateProject (projectId, body, callback) {
        request.put(config.scitran.url + 'projects/' + projectId, {body}, (err, res) => {
            callback(err, res);
        });
    },

    /**
     * Update Note
     *
     * Takes a projectId and a note object and
     * upserts the note.
     */
    updateNote (projectId, newNote, callback) {
        let req = {projectId, newNote, callback};
        if (this.noteRequests > 0) {
            this.noteQueue.push(req);
        } else {
            this.noteRequest(req);
        }
    },

    noteQueue: [],
    noteRequests: 0,

    noteRequest(req) {
        this.noteRequests++;
        this.getProject(req.projectId, (res) => {
            let notes = [];
            let currentNotes = res.body.notes ? res.body.notes : [];
            let noteExists   = false;
            for (let currentNote of currentNotes) {
                if (currentNote.author === req.newNote.author) {
                    noteExists = true;
                    notes.push(req.newNote);
                } else {
                    notes.push(currentNote);
                }
            }
            if (!noteExists) {
                notes.push(req.newNote);
            }
            this.updateProject(req.projectId, {notes: notes}, (err, res) => {
                if (req.callback) {req.callback(res);}
                this.noteRequests--;
                if (this.noteQueue.length > 0) {
                    this.noteRequest(this.noteQueue[0]);
                    this.noteQueue.shift();
                }
            });
        });
    }


};