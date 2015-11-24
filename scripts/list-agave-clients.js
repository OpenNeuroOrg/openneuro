import agave from '../libs/agave';

agave.listClients((err, res) => {
	console.log(JSON.stringify(res.body));
	console.log(res.req.path);
});