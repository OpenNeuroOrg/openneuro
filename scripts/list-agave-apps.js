import agave from '../libs/agave';

agave.listApps((err, res) => {
	console.log(JSON.stringify(res.body));
	console.log(res.req.path);
});