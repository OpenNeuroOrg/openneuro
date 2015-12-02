import agave from '../libs/agave';

let jobId = '6440903727552270821-e0bd34dffff8de6-0001-007';

agave.getJob(jobId, (err, res) => {
	console.log(err);
	console.log(JSON.stringify(res.body));
});