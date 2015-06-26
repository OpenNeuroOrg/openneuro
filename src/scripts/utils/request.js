import request   from 'superagent';
import config    from '../config';
import userStore from '../user/user.store.js';

export default {

	get (path) {
		console.log(userStore);
		return ( 
			request.get(config.scitranUrl + path)
				.set('Authorization', userStore._token)
		);
	},

	post (path) {
		return ( 
			request.post(config.scitranUrl + path)
				.set('Authorization', userStore._token)
		);
	}

}