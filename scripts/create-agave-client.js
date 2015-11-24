import agave from '../libs/agave';

agave.createClient((err, res) => {
	console.log(res.body);
	console.log(res.req.path);
});