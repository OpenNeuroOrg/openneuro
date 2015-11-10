import agave  from '../libs/agave';

agave.refreshAccessToken((err, res) => {
	console.log(err);
	console.log(res.req.path);
	console.log(res.statusCode);
	console.log(res.body);
});