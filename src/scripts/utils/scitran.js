import request   from './request';
import userStore from '../user/user.store';
import files     from './files';
import MD5       from './md5';

// public API ---------------------------------------------------------------------

let scitran = {
    verifyUser,
    createProject,
    createSubject,
    createSession,
    createModality,
    createAcquisition,
	upload
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
    // console.log('create project: ' + projectName);
    let body = {name: projectName};
    request.post('groups/' + groupName + '/projects', {body: body}, callback);
}

/**
 * Create Subject
 *
 */
function createSubject (projectId, subjectName, callback) {
    // console.log('create subject: ' + subjectName);
    let body = {label: subjectName, subject_code: 'subject'};
    request.post('projects/' + projectId + '/sessions', {body: body}, callback);
}

/**
 * Create Session
 *
 */
function createSession (projectId, sessionName, callback) {
    // console.log('create session: ' + sessionName);
    let body = {label: sessionName, subject_code: 'session'};
    request.post('projects/' + projectId + '/sessions', {body: body}, callback);
}

/**
 * Create Modality
 *
 */
function createModality (sessionId, modalityName, callback) {
    // console.log('create modality: ' + modalityName);
    let body = {label: modalityName, datatype: 'modality'};
    // body can have datatype field equal to an arbitrary string
    request.post('sessions/' + sessionId + '/acquisitions', {body: body}, callback);
}

/**
 * Create Acquisition
 *
 */
function createAcquisition (acquisitionName, callback) {
    // console.log('create acquisition: ' + acquisitionName);
    callback();
}

function uploadFile (level, id, file) {
    // if (file.name.indexOf('.nii') == -1) {
        MD5(file, function (hash) {
            files.readAsArrayBuffer(file, function (buffer) {
                console.log('upload');
                console.log(buffer);
                console.log(hash);
                let url = level + '/' + id + '/file/' + file.name;
                request.put(url, {
                    headers: {
                        'Content-Type': 'application/octet-stream',
                        'Content-MD5': hash
                    },
                    body: buffer
                }, function (err, res) {
                    console.log(err);
                    console.log(res);
                });
            });
        });
    // }
}

/**
 * Upload
 *
 * Takes an entire bids filelist and upload recurses
 * through and uploads all the files.
 *
 * TODO
 *    - Check if we should call filelist filetree for 
 *    consistency
 *    - Determine how to upload in between scitran levels
 */
function upload (filelist) {
    let groupName = 'SquishyRoles';
    scitran.createProject(groupName, filelist[0].name, function (err, res) {
        let projectId = res.body._id;
        uploadSubjects(filelist[0].children, projectId);
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
            uploadFile('projects', projectId, subject);
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
            uploadFile('sessions', subjectId, session);
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
            uploadFile('sessions', subjectId, modality);
        }
    }
}

function uploadAquisitions (acquisitions, modalityId) {
    for (let acquisition of acquisitions) {
        // console.log('upload acquisition: ' + acquisition.name);
        uploadFile('acquisitions', modalityId, acquisition);
    }
}