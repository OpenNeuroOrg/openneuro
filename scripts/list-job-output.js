import agave from '../libs/agave';

agave.getJobOutput(process.argv[2], (err, res) => {
	console.log(JSON.stringify(res.body));
	console.log(res.req.path);
});