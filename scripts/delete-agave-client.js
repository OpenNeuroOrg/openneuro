import request from '../libs/request';
import config  from '../config';

request.del(config.agave.url + 'clients/v2/crn_plab_test', {
    headers: {
        Authorization: 'Basic ' + new Buffer(config.agave.username + ':' + config.agave.password).toString('base64')
    }
}, (err, res) => {
	console.log(err);
	console.log(res.body);
});