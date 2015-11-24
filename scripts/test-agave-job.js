import agave  from '../libs/agave';
import fs     from 'fs';

// var jobfile = {
// 	"name":"openfmri-agave-bids-test test-1446118141",
// 	"appId": "openfmri-agave-bids-test-0.2.0",
// 	"batchQueue": "normal",
// 	"executionSystem": "openfmri-stampede.tacc.utexas.edu",
// 	"maxRunTime": "01:00:00",
// 	"memoryPerNode": "1GB",
// 	"nodeCount": 1,
// 	"processorsPerNode": 1,
// 	"archive": true,
// 	"archiveSystem": "docking.storage",
// 	"archivePath": null,
// 	"inputs": {
// 		"bidsFile": "agave://openfmri-corral-storage/ds003_downsampled.tar",
// 	},
// 	"parameters": {
// 		slurmQueue: 'test'
// 	},
// 	"notifications": [
// 		{
// 			"url":"http://scitran.sqm.io:8765/api/v1/jobs/results",
// 			"event":"*",
// 			"persistent":true
// 		},
// 		{
// 			"url":"zack@squishymedia.com",
// 			"event":"FINISHED",
// 			"persistent":false
// 		},
// 		{
// 			"url":"zack@squishymedia.com",
// 			"event":"FAILED",
// 			"persistent":false
// 		}
// 	],
// 	json: true
// };

// var jobfile = {
//   "name":"qap-func-spatial test-1447328928",
//   "appId": "qap-func-spatial-0.1.0",
//   "executionSystem": "cli-stampede.tacc.utexas.edu",
//   "archive": true,
//   "archiveSystem": "openfmri-storage",
//   "archivePath": null,
//   "inputs": {
//     "bidsFile": "agave://openfmri-storage/ds003_downsampled.tar"
//   },
//   "parameters": {
//     "num_cores_per_subject": 1,
//     "num_subjects_at_once": 1,
//     "write_all_outputs": false,
//     "write_report": true,
//     "slice_timing_correction": false,
//     "start_idx": 0,
//     "stop_idx": 0
//   },
//   "notifications": [
//     {
//       "url":"http://scitran.sqm.io:8765/api/v1/jobs/results?job_id=${JOB_ID}&status=${JOB_STATUS}",
//       "event":"*",
//       "persistent":true
//     },
//     {
//       "url":"zack@squishymedia.com",
//       "event":"FINISHED",
//       "persistent":false
//     },
//     {
//       "url":"zack@squishymedia.com",
//       "event":"FAILED",
//       "persistent":false
//     }
//   ]
// };

var jobfile = {
  "name":"qap-func-sp-slurm",
  "appId": "qap-func-sp-slurm-0.1.0",
  "batchQueue": "normal",
  "executionSystem": "slurm-stampede.tacc.utexas.edu",
  "maxRunTime": "00:20:00",
  "memoryPerNode": "8GB",
  "nodeCount": 1,
  "processorsPerNode": 16,
  "archive": true,
  "archiveSystem": "openfmri-storage",
  "archivePath": null,
  "inputs": {
    "bidsFile": "agave://openfmri-storage/ds003_downsampled.tar"
  },
  "parameters": {
    "num_cores_per_subject": 16,
    "num_subjects_at_once": 1,
    "write_all_outputs": false,
    "write_report": true,
    "slice_timing_correction": false,
    "start_idx": 0,
    "stop_idx": 0
  },
  "notifications": [
    {
      "url":"http://scitran.sqm.io:8765/api/v1/jobs/results?job_id=${JOB_ID}&status=${JOB_STATUS}",
      "event":"*",
      "persistent":true
    },
    {
      "url":"zack@squishymedia.com",
      "event":"FINISHED",
      "persistent":false
    },
    {
      "url":"zack@squishymedia.com",
      "event":"FAILED",
      "persistent":false
    }
  ]
};


agave.createJob(jobfile, (err, res) => {
	console.log(err);
	console.log(res.req.path);
	// console.log(res.req);
	console.log(res.statusCode);
	console.log(res.body);
	fs.writeFile('response.json', JSON.stringify(res), (err) => {
		console.log('wrote file');
	});
});