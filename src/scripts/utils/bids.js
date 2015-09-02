import async   from 'async';
import scitran from './scitran';

/**
 * Scitran
 *
 * A library for interactions with the
 * scitran service.
 */
export default  {

// Read -----------------------------------------------------------------------------------

    /**
     * Get BIDS Subjects
     *
     * Takes a projectId and return all BIDS
     * subjects after they are separated out
     * of scitran sessions.
     */
    getBIDSSubjects (projectId, callback) {
        scitran.getSessions(projectId, (sessions) => {
            let subjects = [];
            async.each(sessions, (session, cb) => {
                if (session.subject_code === 'subject') {
                    scitran.getSession(session._id, (res) => {
                        session.children = res.files;
                        session.name = session.label;
                        subjects.push(session);
                        cb();
                    });
                } else {
                    cb();
                }
            }, () => {
                callback(subjects);
            });
        });
    },

    getBIDSSessions (projectId, subjectId, callback) {
        scitran.getSessions(projectId, (sciSessions) => {
            let sessions = [];
            async.each(sciSessions, (session, cb) => {
                if (session.subject_code === subjectId) {
                    scitran.getSession(session._id, (res) => {
                        session.children = res.files;
                        session.name = session.label;
                        sessions.push(session);
                        cb();
                    });
                } else {
                    cb();
                }
            }, () => {
                callback(sessions);
            });
        });
    },

    getBIDSModalities: scitran.getAcquisitions,


    getBIDSDataset (projectId, callback) {
        let self = this;
        let dataset = {};
        scitran.getProject(projectId, (res) => {
            if (res.status !== 200) {return callback(res);}
            let project = res.body;
            dataset = self.formatDataset(project);
            self.getBIDSSubjects(res.body._id, (subjects) => {
                dataset.children = dataset.children.concat(subjects);
                async.each(subjects, (subject, cb) => {
                    self.getBIDSSessions(projectId, subject._id, (sessions) => {
                        subject.children = subject.children.concat(sessions);
                        async.each(sessions, (session, cb1) => {
                            self.getBIDSModalities(session._id, (modalities) => {
                                session.children = session.children.concat(modalities);
                                async.each(modalities, (modality, cb2) => {
                                    scitran.getAcquisition(modality._id, (res) => {
                                        for (let file of res.files) {file.name = file.filename;}
                                        modality.children = res.files;
                                        modality.name = modality.label;
                                        cb2();
                                    });
                                }, cb1);
                            });
                        }, cb);
                    });
                }, () => {callback([dataset])});
            });
        });
    },

    formatDataset (project) {
        for (let file of project.files) {file.name = file.filename;}
        let dataset = {
            _id: project._id,
            name: project.name,
            type: 'folder',
            permissions: project.permissions,
            public: project.public,
            children: project.files,
            description: this.formatDescription(project.notes),
            status: this.formatStatus(project.notes),
        };

        return dataset;
    },

    formatDescription (notes) {
        let description = {
            "Name": "",
            "License": "",
            "Authors": [],
            "Acknowledgements": "",
            "HowToAcknowledge": "",
            "Funding": "",
            "ReferencesAndLinks": ""
        };

        if (notes) {
            for (let note of notes) {
                if (note.author === 'description') {
                    description = JSON.parse(note.text);
                }
            }
        }

        return description;
    },

    formatStatus (notes) {
        let status = {};
        if (notes) {
            for (let note of notes) {
                if (note.author === 'uploadStatus' && note.text === 'incomplete') {
                    status['uploadIncomplete'] = true;
                }
            }
        }
        return status;
    },

// Delete ---------------------------------------------------------------------------------

    deleteDataset (projectId, callback) {
        let self = this;
        scitran.getSessions(projectId, (sessions) => {
            async.each(sessions, (session, cb) => {
                scitran.getAcquisitions(session._id, (acquisitions) => {
                    async.each(acquisitions, (acquisition, cb1) => {
                        scitran.deleteContainer('acquisitions', acquisition._id, cb1);
                    }, () => {
                        scitran.deleteContainer('sessions', session._id, cb);
                    });
                });
            }, () => {
                scitran.deleteContainer('projects', projectId, callback);
            });
        });
    }

};