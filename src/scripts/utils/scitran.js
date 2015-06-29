import request   from './request';
import userStore from '../user/user.store.js';

// public API ---------------------------------------------------------------------

let scitran = {
    verifyUser,
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
 * Upload
 *
 */
function upload (filelist) {
    console.log('create project: ' + filelist[0].name);
    for (var i = 0; i < filelist[0].children.length; i++) {
        var subject = filelist[0].children[i];
        if (subject.children && subject.children.length > 0) {
            console.log('create subject: ' + subject.name);
            for (var j = 0; j < subject.children.length; j++) {
                var session = subject.children[j];
                if (session.children && session.children.length > 0) {
                    console.log('create session: ' + session.name);
                    for (var k = 0; k < session.children.length; k++) {
                        var modality = session.children[k];
                        if (modality.children && modality.children.length > 0) {
                            console.log('create modality: ' + modality.name);
                            for (var l = 0; l < modality.children.length; l++) {
                                var aquisition = modality.children[l]
                                console.log('upload aquisition: ' + aquisition.name);
                            }
                        } else {
                            console.log('upload session file: ' + modality.name)
                        }
                    }
                } else {
                    console.log('upload subject file: ' + session.name);
                }
            }
        } else {
            console.log('upload top level file: ' + subject.name);
        }
    }
}

function createProject (groupName, projectName) {
    var url = 'https://scitran.sqm.io/' + 
    request.get('https://scitran.sqm.io/api/users/self')
            .set('Authorization', this._token)
            .end(function (err, res) {
                console.log(res.body);
            });
}