import agave from '../libs/agave';

agave.listClients((err, res) => {
	console.log(res.body);
	console.log(res.req.path);
});