import scitran from '../utils/scitran';
import bids    from '../utils/bids';
import uploads from '../utils/upload';
import files   from '../utils/files';
import config  from '../../../config';
import diff    from './diff';

export default {

// progress --------------------------------------------------------------------------

    /**
     * Current Project Id
     */
    currentProjectId: null,

    /**
     * Current Files
     *
     * An array of file names that are currently being uploaded.
     */
    currentFiles: [],

    /**
     * Total
     */
    total: 0,

    /**
     * Completed
     */
    completed: 0,

// upload ----------------------------------------------------------------------------

    /**
     * Upload
     *
     * Takes an entire bids file tree and and file count
     * and recurses through and uploads all the files.
     * Additionally takes a progress callback that gets
     * updated at the start and end of every file or
     * folder upload request and an error callback.
     */
    upload (userId, fileTree, validation, summary, count, progress, error) {
        this.total = count;
        this.completed = 0;
        this.error = error;
        this.currentProjectId = null;
        this.progressStart = (filename) => {
            this.currentFiles.push(filename);
            progress({status: 'uploading', total: this.total, completed: this.completed, currentFiles: this.currentFiles});
        };
        this.progressEnd = (filename) => {
            let index = this.currentFiles.indexOf(filename);
            this.currentFiles.splice(index, 1);
            this.completed++;
            progress({status: 'uploading', total: this.total, completed: this.completed, currentFiles: this.currentFiles}, this.currentProjectId);
        };
        let existingProject = null;
        scitran.getProjects({authenticate: true}, (projects) => {
            for (let project of projects) {
                if (project.label === fileTree[0].name && project.group === userId) {
                    project.children = project.files;
                    existingProject  = project;
                    break;
                }
            }

            if (existingProject) {
                this.currentProjectId = existingProject._id;
                bids.getDatasetTree(existingProject, (oldDataset) => {
                    let newDataset = fileTree[0];
                    diff.datasets(newDataset.children, oldDataset[0].children, (subjectUploads, completedFiles) => {
                        this.completed = this.completed + completedFiles.length + 1;
                        progress({status: 'calculating', total: this.total, completed: this.completed, currentFiles: this.currentFiles});
                        this.uploadSubjects(newDataset.name, subjectUploads, this.currentProjectId);
                    });
                }, {}, (resumeProgress) => {
                    resumeProgress.status       = 'calculating';
                    resumeProgress.total        = count;
                    resumeProgress.currentFiles = this.currentFiles;
                    progress(resumeProgress, existingProject._id);
                });
            } else {
                this.createContainer(scitran.createProject, [userId, fileTree[0].name], (err, res) => {
                    let projectId = res.body._id;
                    scitran.addTag('projects', projectId, 'incomplete', () => {
                        this.uploadSubjects(fileTree[0].name, fileTree[0].children, projectId, validation, summary);
                    });
                });
            }
        });
    },

    /**
     * Upload Subjects
     *
     */
    uploadSubjects (datasetName, subjects, projectId, validation, summary) {
        this.currentProjectId = projectId;
        for (let subject of subjects) {
            if (subject.children) {
                this.uploadSubjects(datasetName, subject.children, projectId, validation, summary);
            } else {
                if (subject.name === 'dataset_description.json') {
                    files.read(subject, (contents) => {
                        let description = JSON.parse(contents);
                        description.Name = datasetName;
                        let authors = [];
                        if (description.hasOwnProperty('Authors')) {
                            for (let i = 0; i < description.Authors.length; i++) {
                                let author = description.Authors[i];
                                authors.push({name: author, ORCIDID: ''});
                            }
                        }
                        scitran.updateProject(projectId, {metadata: {authors, validation, summary}}, () => {
                            let file = new File([JSON.stringify(description)], '/dataset_description.json', {type: 'application/json'});
                            this.uploadFile('projects', projectId, file);
                        });
                    });

                } else {
                    this.uploadFile('projects', projectId, subject);
                }
            }
        }
    },

// queue container and file requests ------------------------------------------------------

    createContainer (func, args, callback) {
        uploads.add({
            func,
            args,
            callback,
            progressStart: this.progressStart,
            progressEnd:   this.progressEnd,
            error:         this.error
        });
    },

    /**
     * Upload File
     *
     * Pushes upload details into an upload queue.
     */
    uploadFile (level, id, file) {
        let url = config.scitran.url +  level + '/' + id + '/files';
        uploads.add({url: url, file: file, progressStart: this.progressStart, progressEnd: this.progressEnd, error: this.error});
    }

};
