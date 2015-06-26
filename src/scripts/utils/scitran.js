// public API ---------------------------------------------------------------------

let scitran = {
	upload
};

export default scitran;

// implementations ----------------------------------------------------------------

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

function createProject (groupName, projectName) {}