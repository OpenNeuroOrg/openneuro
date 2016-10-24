// dependencies -------------------------------------------------------

import React     from 'react';
import Reflux    from 'reflux';
import FPStore   from './front-page.store.js';
import FPActions from './front-page.actions.js';
import Select    from 'react-select';
import Run       from '../dataset/dataset.jobs.run.jsx';
import {Link}    from 'react-router';
import {Panel}   from 'react-bootstrap';

// component setup ----------------------------------------------------

let Pipelines = React.createClass({

    mixins: [Reflux.connect(FPStore)],

// life cycle events --------------------------------------------------

    render() {
        return(
            <span>
                <div className="browse-pipelines">
                    <div className="container">
                        {this._browsePipelines()}
                    </div>
                </div>
                {!this.state.selectedPipeline.id ? null : this._pipelineDetail(this.state.selectedPipeline)}
            </span>
        );
    },

// template methods ---------------------------------------------------

    _browsePipelines() {
        let pipelineOptions = this._pipelineOptions(this.state.apps, this.state.selectedTags);
        return (
            <div className="row">
                <div className="col-sm-6 mate-slide">
                    <h3>Check Out a Few of Our Pipelines</h3>
                    <ul>
                        <li>
                            <button onClick={FPActions.selectPipeline.bind(null, 'mriqc-bare-0.8.7')}>mriqc-bare</button>
                        </li>
                        <li>
                            <button onClick={FPActions.selectPipeline.bind(null, 'mriqc-kiddo-0.8.6')}>mriqc-kiddo</button>
                        </li>
                        <li>
                            <button onClick={FPActions.selectPipeline.bind(null, 'mriqc-bare-0.8.7')}>mriqc-bare</button>
                        </li>
                        <li>
                            <button onClick={FPActions.selectPipeline.bind(null, 'mriqc-kiddo-0.8.6')}>mriqc-kiddo</button>
                        </li>
                    </ul>
                </div>
                <div className="col-sm-6 mate-slide browse">
                    <h3>Or Browse Our Collection</h3>
                    <form>
                        <label>What kinds of pipelines are you interested in?</label>
                        <Select multi simpleValue value={this.state.selectedTags} placeholder="All Tags" options={this.state.tags} onChange={FPActions.selectTag} />
                        <br />
                        <label>browse {pipelineOptions.length} pipelines</label>
                        <span className="select-pipeline">
                            <select value={this.state.selectedPipeline.id} onChange={this._selectPipeline}>
                                <option value="" disabled>Select a Pipeline</option>
                                {pipelineOptions}
                            </select>
                            <span className="select-pipeline-arrow"></span>
                        </span>
                    </form>
                </div>
            </div>
        );
    },

    _pipelineDetail(pipeline) {
        let longDescription = JSON.parse(pipeline.longDescription);
        return (
            <div className="selected-pipeline fade-in">
                <div className="container slide-in-down">
                <span className="active-pipeline-arrow"></span>
                    <div className="row">
                        <div className="col-sm-6 mate-slide">
                            <a href="#" className="close-selected" onClick={FPActions.selectPipeline.bind(null, '')}>X CLOSE</a>
                            <h2>{pipeline.name}</h2>
                            <p>{longDescription.description}</p>
                            <h4>Acknowledgments</h4>
                            <p>{longDescription.acknowledgments}</p>
                            <h4>Support</h4>
                            <p><a href={pipeline.longDescription.support}>{longDescription.support}</a></p>
                            <h4>Help</h4>
                            <p><a href={pipeline.helpURI}>{pipeline.helpURI}</a></p>
                        </div>
                        <div className="col-sm-6 mate-slide">
                            <div className="row">
                                <div className="col-sm-6">
                                    <h2>Example Analysis</h2>
                                    <span>from dataset <Link to="snapshot" params={{datasetId: '57dc36a7a76c87000d24e650', snapshotId: '57e04d604d88b0000a3e3ece'}}>00_None_small-5</Link></span>
                                </div>
                                <div className="col-sm-6">
                                    <h3><a href="#">Explore More</a></h3>
                                </div>
                            </div>
                            <Panel className="jobs" header={'job.appLabel' + ' - v' + 'job.appVersion'} eventKey={'job.appId'}>
                                <Run run={runData} />
                            </Panel>
                        </div>
                    </div>
                </div>
            </div>
        );
    },

// custom methods -----------------------------------------------------

    _tagOptions(tags) {
        return tags.map((tag) => {
            return <option value={tag} key={tag}>{tag}</option>;
        });
    },

    _selectPipeline(e) {
        FPActions.selectPipeline(e.target.value);
    },

    _pipelineOptions(apps, selectedTags) {
        let filteredApps = [];
        if (selectedTags == null || selectedTags.length === 0) {
            filteredApps = apps;
        } else {
            selectedTags = selectedTags.split(',');
            for (let app of apps) {
                tagloop:
                    for (let tag of selectedTags) {
                        if (app.tags.indexOf(tag) > -1) {
                            filteredApps.push(app);
                            break tagloop;
                        }
                    }
            }
        }
        return filteredApps.map((app) => {
            return <option value={app.id} key={app.id}>{app.name}</option>;
        });
    }

});

export default Pipelines;


var runData = {
    '_id': '57e04d9971bbc20001060a69',
    'jobId': '9173401224112172570-242ac115-0001-007',
    'agave': {
        'id': '9173401224112172570-242ac115-0001-007',
        'name': 'crn-automated-job',
        'owner': 'crn_plab',
        'appId': 'mriqc-kiddo-0.8.6',
        'executionSystem': 'slurm-ls5.tacc.utexas.edu',
        'batchQueue': 'normal',
        'nodeCount': 1,
        'processorsPerNode': 8,
        'memoryPerNode': 64,
        'maxRunTime': '05:00:00',
        'archive': true,
        'retries': 0,
        'localId': '412253',
        'created': '2016-09-21T02:41:56.000-05:00',
        'archivePath': 'crn_plab/archive/jobs/job-9173401224112172570-242ac115-0001-007',
        'archiveSystem': 'openfmri-archive',
        'outputPath': '/scratch/03843/crn_plab/crn_plab/job-9173401224112172570-242ac115-0001-007-crn-automated-job',
        'status': 'FINISHED',
        'submitTime': '2016-09-20T22:42:38.000-05:00',
        'startTime': '2016-09-20T21:42:52.000-05:00',
        'endTime': '2016-09-19T16:18:41.000-05:00',
        'inputs': {
            'bidsFolder': [
                'agave://dev-openfmri.storage/2d2d03d1214ba27d4af5fa97380ff703'
            ]
        },
        'parameters': {
            'subjectList': '01',
            'groupSize': 4
        },
        '_links': {
            'self': {
                'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007'
            },
            'app': {
                'href': 'https://api.tacc.utexas.edu/apps/v2/mriqc-kiddo-0.8.6'
            },
            'executionSystem': {
                'href': 'https://api.tacc.utexas.edu/systems/v2/slurm-ls5.tacc.utexas.edu'
            },
            'archiveSystem': {
                'href': 'https://api.tacc.utexas.edu/systems/v2/openfmri-archive'
            },
            'archiveData': {
                'href': 'https://api.tacc.utexas.edu/files/v2/listings/system/openfmri-archive/crn_plab/archive/jobs/job-9173401224112172570-242ac115-0001-007'
            },
            'owner': {
                'href': 'https://api.tacc.utexas.edu/profiles/v2/crn_plab'
            },
            'permissions': {
                'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007/pems'
            },
            'history': {
                'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007/history'
            },
            'metadata': {
                'href': 'https://api.tacc.utexas.edu/meta/v2/data/?q=%7B%22associationIds%22%3A%229173401224112172570-242ac115-0001-007%22%7D'
            },
            'notifications': {
                'href': 'https://api.tacc.utexas.edu/notifications/v2/?associatedUuid=9173401224112172570-242ac115-0001-007'
            }
        }
    },
    'appId': 'mriqc-kiddo-0.8.6',
    'parameters': {
        'subjectList': '01',
        'groupSize': 4
    },
    'memoryPerNode': 64,
    'nodeCount': 1,
    'processorsPerNode': 8,
    'batchQueue': 'normal',
    'appLabel': 'MRIQC (participants-group)',
    'appVersion': '0.8.6',
    'datasetHash': '2d2d03d1214ba27d4af5fa97380ff703',
    'datasetId': '57dc36a7a76c87000d24e650',
    'datasetLabel': '00_None_small-5',
    'userId': 'test@test.com',
    'parametersHash': '231e771e6ff5b80ff5d0a9897326b93d',
    'snapshotId': '57e04d604d88b0000a3e3ece',
    'attempts': 1,
    'results': [
        {
            'name': 'anatMRIQC.csv',
            'path': '/out/anatMRIQC.csv',
            'lastModified': '2016-09-19T16:12:01.000-05:00',
            'length': 1071,
            'permission': 'READ_WRITE',
            'mimeType': 'application/octet-stream',
            'format': 'unknown',
            'type': 'file',
            '_links': {
                'self': {
                    'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007/outputs/media/out/anatMRIQC.csv'
                },
                'system': {
                    'href': 'https://api.tacc.utexas.edu/systems/v2/openfmri-archive'
                },
                'parent': {
                    'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007'
                }
            }
        },
        {
            'name': 'anatomical_group.pdf',
            'path': '/out/anatomical_group.pdf',
            'lastModified': '2016-09-19T16:12:02.000-05:00',
            'length': 10347,
            'permission': 'READ_WRITE',
            'mimeType': 'application/octet-stream',
            'format': 'unknown',
            'type': 'file',
            '_links': {
                'self': {
                    'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007/outputs/media/out/anatomical_group.pdf'
                },
                'system': {
                    'href': 'https://api.tacc.utexas.edu/systems/v2/openfmri-archive'
                },
                'parent': {
                    'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007'
                }
            }
        },
        {
            'name': 'anatomical_sub-01.pdf',
            'path': '/out/anatomical_sub-01.pdf',
            'lastModified': '2016-09-19T16:12:03.000-05:00',
            'length': 10371,
            'permission': 'READ_WRITE',
            'mimeType': 'application/octet-stream',
            'format': 'unknown',
            'type': 'file',
            '_links': {
                'self': {
                    'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007/outputs/media/out/anatomical_sub-01.pdf'
                },
                'system': {
                    'href': 'https://api.tacc.utexas.edu/systems/v2/openfmri-archive'
                },
                'parent': {
                    'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007'
                }
            }
        },
        {
            'name': 'funcMRIQC.csv',
            'path': '/out/funcMRIQC.csv',
            'lastModified': '2016-09-19T16:12:07.000-05:00',
            'length': 1457,
            'permission': 'READ_WRITE',
            'mimeType': 'application/octet-stream',
            'format': 'unknown',
            'type': 'file',
            '_links': {
                'self': {
                    'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007/outputs/media/out/funcMRIQC.csv'
                },
                'system': {
                    'href': 'https://api.tacc.utexas.edu/systems/v2/openfmri-archive'
                },
                'parent': {
                    'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007'
                }
            }
        },
        {
            'name': 'functional_group.pdf',
            'path': '/out/functional_group.pdf',
            'lastModified': '2016-09-19T16:12:08.000-05:00',
            'length': 11223,
            'permission': 'READ_WRITE',
            'mimeType': 'application/octet-stream',
            'format': 'unknown',
            'type': 'file',
            '_links': {
                'self': {
                    'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007/outputs/media/out/functional_group.pdf'
                },
                'system': {
                    'href': 'https://api.tacc.utexas.edu/systems/v2/openfmri-archive'
                },
                'parent': {
                    'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007'
                }
            }
        },
        {
            'name': 'functional_sub-01.pdf',
            'path': '/out/functional_sub-01.pdf',
            'lastModified': '2016-09-19T16:12:09.000-05:00',
            'length': 11153,
            'permission': 'READ_WRITE',
            'mimeType': 'application/octet-stream',
            'format': 'unknown',
            'type': 'file',
            '_links': {
                'self': {
                    'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007/outputs/media/out/functional_sub-01.pdf'
                },
                'system': {
                    'href': 'https://api.tacc.utexas.edu/systems/v2/openfmri-archive'
                },
                'parent': {
                    'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007'
                }
            }
        },
        {
            'name': 'logs',
            'path': '/out/logs',
            'lastModified': '2016-09-19T16:12:10.000-05:00',
            'length': 32768,
            'permission': 'READ_WRITE',
            'mimeType': 'text/directory',
            'format': 'folder',
            'type': 'dir',
            '_links': {
                'self': {
                    'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007/outputs/media/out/logs'
                },
                'system': {
                    'href': 'https://api.tacc.utexas.edu/systems/v2/openfmri-archive'
                },
                'parent': {
                    'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007'
                }
            },
            'children': []
        },
        {
            'name': 'derivatives',
            'path': '/out/derivatives',
            'lastModified': '2016-09-19T16:12:06.000-05:00',
            'length': 32768,
            'permission': 'READ_WRITE',
            'mimeType': 'text/directory',
            'format': 'folder',
            'type': 'dir',
            '_links': {
                'self': {
                    'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007/outputs/media/out/derivatives'
                },
                'system': {
                    'href': 'https://api.tacc.utexas.edu/systems/v2/openfmri-archive'
                },
                'parent': {
                    'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007'
                }
            },
            'children': [
                {
                    'name': 'anat_sub-01_ses-single_session_run-single_run.json',
                    'path': '/out/derivatives/anat_sub-01_ses-single_session_run-single_run.json',
                    'lastModified': '2016-09-19T16:12:05.000-05:00',
                    'length': 1444,
                    'permission': 'READ_WRITE',
                    'mimeType': 'application/octet-stream',
                    'format': 'unknown',
                    'type': 'file',
                    '_links': {
                        'self': {
                            'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007/o…s/media/out/derivatives/anat_sub-01_ses-single_session_run-single_run.json'
                        },
                        'system': {
                            'href': 'https://api.tacc.utexas.edu/systems/v2/openfmri-archive'
                        },
                        'parent': {
                            'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007'
                        }
                    }
                },
                {
                    'name': 'func_sub-01_ses-single_session_run-task-balloonanalogrisktask_run-01.json',
                    'path': '/out/derivatives/func_sub-01_ses-single_session_run-task-balloonanalogrisktask_run-01.json',
                    'lastModified': '2016-09-19T16:12:06.000-05:00',
                    'length': 1630,
                    'permission': 'READ_WRITE',
                    'mimeType': 'application/octet-stream',
                    'format': 'unknown',
                    'type': 'file',
                    '_links': {
                        'self': {
                            'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007/o…/func_sub-01_ses-single_session_run-task-balloonanalogrisktask_run-01.json'
                        },
                        'system': {
                            'href': 'https://api.tacc.utexas.edu/systems/v2/openfmri-archive'
                        },
                        'parent': {
                            'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007'
                        }
                    }
                }
            ]
        }
    ],
    'logs': [
        {
            'name': 'command-9173401224112172570-242ac115-0001-007.sh',
            'path': '/log/command-9173401224112172570-242ac115-0001-007.sh',
            'lastModified': '2016-09-19T16:11:58.000-05:00',
            'length': 231,
            'permission': 'READ_WRITE',
            'mimeType': 'application/octet-stream',
            'format': 'unknown',
            'type': 'file',
            '_links': {
                'self': {
                    'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007/outputs/media/log/command-9173401224112172570-242ac115-0001-007.sh'
                },
                'system': {
                    'href': 'https://api.tacc.utexas.edu/systems/v2/openfmri-archive'
                },
                'parent': {
                    'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007'
                }
            }
        },
        {
            'name': 'exit_code.txt',
            'path': '/log/exit_code.txt',
            'lastModified': '2016-09-19T16:11:59.000-05:00',
            'length': 2,
            'permission': 'READ_WRITE',
            'mimeType': 'application/octet-stream',
            'format': 'unknown',
            'type': 'file',
            '_links': {
                'self': {
                    'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007/outputs/media/log/exit_code.txt'
                },
                'system': {
                    'href': 'https://api.tacc.utexas.edu/systems/v2/openfmri-archive'
                },
                'parent': {
                    'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007'
                }
            }
        },
        {
            'name': 'logfile.txt',
            'path': '/log/logfile.txt',
            'lastModified': '2016-09-19T16:12:00.000-05:00',
            'length': 1023,
            'permission': 'READ_WRITE',
            'mimeType': 'application/octet-stream',
            'format': 'unknown',
            'type': 'file',
            '_links': {
                'self': {
                    'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007/outputs/media/log/logfile.txt'
                },
                'system': {
                    'href': 'https://api.tacc.utexas.edu/systems/v2/openfmri-archive'
                },
                'parent': {
                    'href': 'https://api.tacc.utexas.edu/jobs/v2/9173401224112172570-242ac115-0001-007'
                }
            }
        }
    ],
    'statusCode': 0
};