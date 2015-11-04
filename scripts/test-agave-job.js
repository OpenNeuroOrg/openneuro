import agave  from '../libs/agave';
import config from '../config';

var jobfile = {
	"name":"openfmri-agave-bids-test test-1446118141",
	"appId": "openfmri-agave-bids-test-0.2.0",
	// "batchQueue": "default",
	"executionSystem": "openfmri-stampede.tacc.utexas.edu",
	"maxRunTime": "01:00:00",
	"memoryPerNode": "1GB",
	"nodeCount": 1,
	"processorsPerNode": 1,
	"archive": true,
	"archiveSystem": "docking.storage",
	"archivePath": null,
	"inputs": {
		"bidsFile": "agave://openfmri-corral-storage/ds003_downsampled.tar"
	},
	"parameters": {},
	"notifications": [
		{
			"url":"http://requestbin.agaveapi.co/1edizul1?job_id=${JOB_ID}&status=${JOB_STATUS}",
			"event":"*",
			"persistent":true
		},
		// {
		// 	"url":"zack@squishymedia.com",
		// 	"event":"FINISHED",
		// 	"persistent":false
		// },
		// {
		// 	"url":"zack@squishymedia.com",
		// 	"event":"FAILED",
		// 	"persistent":false
		// }
	]
};

agave.createJob(jobfile, '6OWIFzQoNB1AJoPXo23l6LKnqq4a', (err, res) => {
	console.log(err);
	console.log(res.req.path);
	console.log(res.statusCode);
	console.log(res.body);
});