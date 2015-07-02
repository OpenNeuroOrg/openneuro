import request   from './request';
import userStore from '../user/user.store';
import files     from './files';
import MD5       from 'MD5';

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
    console.log('create project: ' + projectName);
    let body = {name: projectName};
    request.post('groups/' + groupName + '/projects', body, callback);
}

/**
 * Create Subject
 *
 */
function createSubject (projectId, subjectName, callback) {
    console.log('create subject: ' + subjectName);
    let body = {label: subjectName};
    request.post('projects/' + projectId + '/sessions', body, callback);
}

/**
 * Create Session
 *
 */
function createSession (sessionName, callback) {
    console.log('create session: ' + sessionName);
    callback();
}

/**
 * Create Modality
 *
 */
function createModality (sessionId, modalityName, callback) {
    console.log('create modality: ' + modalityName);
    let body = {label: modalityName};
    request.post('sessions/' + sessionId + '/acquisitions', body, callback);
}

/**
 * Create Acquisition
 *
 */
function createAcquisition (acquisitionName, callback) {
    console.log('create acquisition: ' + acquisitionName);
    callback();
}

function uploadFile (level, id, file) {
    files.read(file, function (contents) {
        let url = level + '/' + id + '/file/' + file.name;
        request.upload(url, MD5(contents), contents, file.name);
    });
    // request.post(level + '/' + id + '/file/' + file.name);
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
 *    - Break anonymous functions out in to named functions
 *    that call on another to do away with deep hard to
 *    read nesting.
 */
function upload (filelist) {
    let groupName = 'SquishyRoles';
    scitran.createProject(groupName, filelist[0].name, function (err, res) {
        let projectId = res.body._id;
        
        for (var i = 0; i < filelist[0].children.length; i++) {
            var subject = filelist[0].children[i];
            if (subject.children && subject.children.length > 0) {
                
                scitran.createSubject(projectId, subject.name, function (err, res) {
                    let subjectId = res.body._id;

                    for (var j = 0; j < subject.children.length; j++) {
                        var session = subject.children[j];
                        if (session.children && session.children.length > 0) {

                            scitran.createSession(session.name, function () {
                                for (var k = 0; k < session.children.length; k++) {
                                    var modality = session.children[k];
                                    if (modality.children && modality.children.length > 0) {

                                        scitran.createModality(subjectId, modality.name, function () {
                                            for (var l = 0; l < modality.children.length; l++) {
                                                var acquisition = modality.children[l]
                                                console.log('upload acquisition: ' + acquisition.name);
                                            } 
                                        });
                                    } else {
                                        console.log('upload session file: ' + modality.name)
                                    }
                                }
                            });
                                
                        } else {
                            console.log('upload subject file: ' + session.name);
                        }
                    }

                });
                    
            } else {
                uploadFile('projects', projectId, subject);
                // console.log('upload top level file: ' + subject.name);
            }
        }

    });
}