import agave  from '../libs/agave';
import config from '../config';

agave.getAuthToken(config.agave.consumerKey, config.agave.consumerSecret, (err, res) => {
	console.log(err);
	console.log(res.req.path);
	console.log(res.statusCode);
	console.log(res.body);
});