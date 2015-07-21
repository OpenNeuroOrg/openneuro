import request   from './request';
import uploads   from './upload';
import userStore from '../user/user.store';

/**
 * Scitran
 *
 * A library for interactions with the
 * scitran service.
 */
export default  {

    /**
     * Verify User
     *
     * Checks if the currently logged in users
     * in in the scitran system and returns a
     * user object.
     */
    verifyUser (callback) {
        request.get('users/self', callback);
    },

    /**
     * Create Project
     *
     * Takes a group name and a project name and
     * generates a request to make a project in scitran.
     */
    createProject (groupName, projectName, callback) {
        let body = {name: projectName};
        request.post('groups/' + groupName + '/projects', {body: body}, callback);
    },

    /**
     * Create Subject
     *
     */
    createSubject (projectId, subjectName, callback) {
        let body = {label: subjectName, subject_code: 'subject'};
        request.post('projects/' + projectId + '/sessions', {body: body}, callback);
    },

    /**
     * Create Session
     *
     */
    createSession (projectId, sessionName, callback) {
        let body = {label: sessionName, subject_code: 'session'};
        request.post('projects/' + projectId + '/sessions', {body: body}, callback);
    },

    /**
     * Create Modality
     *
     */
    createModality (sessionId, modalityName, callback) {
        let body = {label: modalityName, datatype: 'modality'};
        request.post('sessions/' + sessionId + '/acquisitions', {body: body}, callback);
    },

    /**
     * Upload File
     *
     * Pushed upload details into an upload queue.
     */
    uploadFile (level, id, file, tag) {
        let url = level + '/' + id + '/file/' + file.name;
        uploads.add({url: url, file: file, tag: tag, progress: this.progress});
    },

    /**
     * Upload
     *
     * Takes an entire bids file tree and upload recurses
     * through and uploads all the files.
     */
    upload (fileTree, count, progress) {
        let self = this;
        self.completed = 0;
        self.count = count;
        self.progress = function () {
            self.completed++;
            progress({total: self.count, completed: self.completed});
        }
        let groupName = 'SquishyRoles';
        self.createProject(groupName, fileTree[0].name, function (err, res) {
            let projectId = res.body._id;
            self.progress();
            self.uploadSubjects(fileTree[0].children, projectId);
        });
    },

    uploadSubjects (subjects, projectId) {
        let self = this;
        for (let subject of subjects) {
            if (subject.children && subject.children.length > 0) {
                self.createSubject(projectId, subject.name, function (err, res) {
                    self.progress();
                    let subjectId = res.body._id;
                    self.uploadSessions(subject.children, projectId, subjectId);
                });
            } else {
                self.uploadFile('projects', projectId, subject, 'project');
            }
        }
    },

    uploadSessions (sessions, projectId, subjectId) {
        let self = this;
        for (let session of sessions) {
            if (session.children && session.children.length > 0) {
                self.createSession(projectId, session.name, function () {
                    self.progress();
                    self.uploadModalities(session.children, subjectId);
                }); 
            } else {
                self.uploadFile('sessions', subjectId, session, 'subject');
            }
        }
    },

    uploadModalities (modalities, subjectId) {
        let self = this;
        for (let modality of modalities) {
            if (modality.children && modality.children.length > 0) {
                self.createModality(subjectId, modality.name, function (err, res) {
                    self.progress();
                    let modalityId = res.body._id;
                    self.uploadAquisitions(modality.children, modalityId);
                });
            } else {
                self.uploadFile('sessions', subjectId, modality, 'session');
            }
        }
    },

    uploadAquisitions (acquisitions, modalityId) {
        for (let acquisition of acquisitions) {
            this.uploadFile('acquisitions', modalityId, acquisition, 'modality');
        }
    },

    getProjects (callback) {
        request.get('projects', function (err, res) {
            callback(res.body);
        });
    }

};