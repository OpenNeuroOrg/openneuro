import agave  from '../libs/agave';
import config from '../config';
import fs     from 'fs';

var jobfile = {
	"name":"openfmri-agave-bids-test test-1446118141",
	"appId": "openfmri-agave-bids-test-0.2.0",
	"batchQueue": "normal",
	"executionSystem": "openfmri-stampede.tacc.utexas.edu",
	"maxRunTime": "01:00:00",
	"memoryPerNode": "1GB",
	"nodeCount": 1,
	"processorsPerNode": 1,
	"archive": true,
	"archiveSystem": "docking.storage",
	"archivePath": null,
	"inputs": {
		"bidsFile": "agave://openfmri-corral-storage/ds003_downsampled.tar",
	},
	"parameters": {
		slurmQueue: 'test'
	},
	"notifications": [
		{
			"url":"http://scitran.sqm.io:8765/api/v1/jobs/results",
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
	],
	json: true
};

agave.createJob(jobfile, '178514c154c25bd1e3b8e28e4089df5d', (err, res) => {
	console.log(err);
	console.log(res.req.path);
	// console.log(res.req);
	console.log(res.statusCode);
	console.log(res.body);
	fs.writeFile('response.json', JSON.stringify(res), (err) => {
		console.log('wrote file');
	});
});