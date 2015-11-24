var request = require("request");

var $token = 'fZBnwG54ECtDHBsIss0eu_ic_UYa';

var options = {
  method: 'POST',
  url: 'https://api.tacc.utexas.edu/jobs/v2/',
  qs: {
    pretty: 'true'
  },
  headers: {
    'postman-token': '18fa541f-a631-e632-c334-57ace99c2126',
    'cache-control': 'no-cache',
    authorization: 'Bearer ' + $token,
    'content-type': 'application/json'
  },
  body: {
    name: 'squishy-agave-bids-test',
    appId: 'openfmri-agave-bids-test-0.2.0',
    archive: true,
    inputs: {
      bidsFile: 'agave://openfmri-corral-storage/ds003_downsampled.tar'
    },
    parameter: {
      slurmQueue: 'asdfa'
    },
    notifications: [{
      url: 'http://requestbin.agaveapi.co/w9vimjw9?job_id=${JOB_ID}&status=${JOB_STATUS}',
      event: '*',
      persistent: true
    },
      {
        url: 'dooley@tacc.utexas.edu',
        event: 'FINISHED',
        persistent: false
      },
      {
        url: 'dooley@tacc.utexas.edu',
        event: 'FAILED',
        persistent: false
      }]
  },
  json: true
};

request(options, function(error, response, body) {
  if (error)
    throw new Error(error);

  console.log(body);
});
