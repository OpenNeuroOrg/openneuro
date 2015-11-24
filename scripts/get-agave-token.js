import agave  from '../libs/agave';

agave.getAccessToken((err, res) => {
	console.log(err);
	console.log(res.req.path);
	console.log(res.statusCode);
	console.log(res.body);
});