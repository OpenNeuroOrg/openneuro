import agave  from '../libs/agave';

agave.listJobs('HUjFRiR0Buga8JohEZkY2LX4MhYa', (err, res) => {
	console.log(err);
	console.log(res.req.path);
	console.log(res.statusCode);
	console.log(res.body);
});