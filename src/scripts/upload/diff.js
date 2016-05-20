export default {

    progressStart: [],
    progressEnd: [],

    /**
     * Resume Subjects
     *
     */
    resumeSubjects (newSubjects, oldSubjects, callback) {
        this.progressStart = [], this.progressEnd = [];
        let subjectUploads = [];
        for (let i = 0; i < newSubjects.length; i++) {
            let newSubject = newSubjects[i];
            let oldSubject = this.contains(oldSubjects, newSubject);
            if (oldSubject) {
                this.progressStart.push(newSubject.name);
                this.progressEnd.push(newSubject.name);
                if (newSubject.type === 'folder') {
                    subjectUploads.push({
                        _id:      oldSubject._id,
                        name:     newSubject.name,
                        type:     'folder',
                        ignore:   true,
                        children: this.resumeSessions(newSubject.children, oldSubject.children, oldSubject._id)
                    });
                }
            } else {
                subjectUploads.push(newSubject);
            }
        }
        if (subjectUploads.length > 0) {
            callback(subjectUploads, this.progressStart, this.progressEnd);
        }
    },

    /**
     * Resume Sessions
     *
     */
    resumeSessions (newSessions, oldSessions, subjectId) {
        let sessionUploads = [];
        for (let i = 0; i < newSessions.length; i++) {
            let newSession = newSessions[i];
            let oldSession = this.contains(oldSessions, newSession);
            if (oldSession) {
                this.progressStart.push(newSession.name);
                this.progressEnd.push(newSession.name);
                if (newSession.type === 'folder') {
                    sessionUploads.push({
                        _id:      oldSession._id,
                        name:     newSession.name,
                        type:     'folder',
                        ignore:   true,
                        children: this.resumeModalities(newSession.children, oldSession.children, oldSession._id)
                    });
                }
            } else {
                sessionUploads.push(newSession);
            }
        }
        return sessionUploads;
    },

    /**
     * Resume Modalities
     *
     */
    resumeModalities (newModalities, oldModalities, subjectId) {
        let modalityUploads = [];
        for (let i = 0; i < newModalities.length; i++) {
            let newModality = newModalities[i];
            let oldModality = this.contains(oldModalities, newModality);
            if (oldModality) {
                this.progressStart.push(newModality.name);
                this.progressEnd.push(newModality.name);
                if (newModality.type === 'folder') {
                    modalityUploads.push({
                        _id:      oldModality._id,
                        name:     newModality.name,
                        type:     'folder',
                        ignore:   true,
                        children: this.resumeAcquisitions(newModality.children, oldModality.children, oldModality._id)
                    });
                }
            } else {
                modalityUploads.push(newModality);
            }
        }
        return modalityUploads;
    },

    /**
     * Resume Acquisitions
     *
     */
    resumeAcquisitions (newAcquisitions, oldAcquisitions, modalityId) {
        let acquisitionUploads = [];
        for (let i = 0; i < newAcquisitions.length; i++) {
            let newAcquisition = newAcquisitions[i];
            let oldAcquisition = this.contains(oldAcquisitions, newAcquisition);
            if (oldAcquisition) {
                this.progressStart.push(newAcquisition.name);
                this.progressEnd.push(newAcquisition.name);
            } else {
                acquisitionUploads.push(newAcquisition);
            }
        }
        return acquisitionUploads;
    },

    /**
     * Contains
     *
     * Takes an array of container children and
     * an element. Checks if the element already
     * exists in the array and return the match
     * from the array.
     */
    contains (arr, elem) {
        let match = null;
        for (let i = 0; i < arr.length; i++) {
            let arrayElem = arr[i];
            if (arrayElem.name === elem.name) {
                match = arrayElem;
            }
        }
        return match;
    }
}