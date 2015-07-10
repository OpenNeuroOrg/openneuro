import request   from './request';
import uploads   from './upload';
import userStore from '../user/user.store';

// public API ---------------------------------------------------------------------

let scitran = {
    verifyUser,
    createProject,
    createSubject,
    createSession,
    createModality,
	upload,
};

export default scitran;

// implementations ----------------------------------------------------------------

/**
 * Verify User
 *
 * Checks if the currently logged in users
 * in in the scitran system and returns a
 * user object.
 */
function verifyUser (callback) {
    request.get('users/self', callback);
}

/**
 * Create Project
 *
 * Takes a group name and a project name and
 * generates a request to make a project in scitran.
 */
function createProject (groupName, projectName, callback) {
    let body = {name: projectName};
    request.post('groups/' + groupName + '/projects', {body: body}, callback);
}

/**
 * Create Subject
 *
 */
function createSubject (projectId, subjectName, callback) {
    let body = {label: subjectName, subject_code: 'subject'};
    request.post('projects/' + projectId + '/sessions', {body: body}, callback);
}

/**
 * Create Session
 *
 */
function createSession (projectId, sessionName, callback) {
    let body = {label: sessionName, subject_code: 'session'};
    request.post('projects/' + projectId + '/sessions', {body: body}, callback);
}

/**
 * Create Modality
 *
 */
function createModality (sessionId, modalityName, callback) {
    let body = {label: modalityName, datatype: 'modality'};
    request.post('sessions/' + sessionId + '/acquisitions', {body: body}, callback);
}

/**
 * Upload File
 *
 * Pushed upload details into an upload queue.
 */
function uploadFile (level, id, file, tag) {
    let url = level + '/' + id + '/file/' + file.name;
    uploads.add({url: url, file: file, tag: tag});
}

/**
 * Upload
 *
 * Takes an entire bids file tree and upload recurses
 * through and uploads all the files.
 */
function upload (fileTree) {
    let groupName = 'SquishyRoles';
    scitran.createProject(groupName, fileTree[0].name, function (err, res) {
        let projectId = res.body._id;
        uploadSubjects(fileTree[0].children, projectId);
    });
}

function uploadSubjects (subjects, projectId) {
    for (let subject of subjects) {
        if (subject.children && subject.children.length > 0) {
            scitran.createSubject(projectId, subject.name, function (err, res) {
                let subjectId = res.body._id;
                uploadSessions(subject.children, projectId, subjectId);
            });
        } else {
            uploadFile('projects', projectId, subject, 'project');
        }
    }
}

function uploadSessions (sessions, projectId, subjectId) {
    for (let session of sessions) {
        if (session.children && session.children.length > 0) {
            scitran.createSession(projectId, session.name, function () {
                uploadModalities(session.children, subjectId);
            }); 
        } else {
            // needs tag to assosiate with being uploaded to subject level
            uploadFile('sessions', subjectId, session, 'subject');
        }
    }
}

function uploadModalities (modalities, subjectId) {
    for (let modality of modalities) {
        if (modality.children && modality.children.length > 0) {
            scitran.createModality(subjectId, modality.name, function (err, res) {
                let modalityId = res.body._id;
                uploadAquisitions(modality.children, modalityId);
            });
        } else {
            // needs tag to associate with being upload to session level
            uploadFile('sessions', subjectId, modality, 'session');
        }
    }
}

function uploadAquisitions (acquisitions, modalityId) {
    for (let acquisition of acquisitions) {
        uploadFile('acquisitions', modalityId, acquisition, 'modality');
    }
}