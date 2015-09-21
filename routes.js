import request from './request';

export default (router) => {
	
	router.get('/', (req, res) => {
		res.send('Hello World!');
	});

	router.post('/users', (req, res) => {
		let email     = req.body.hasOwnProperty('email')     ? req.body.email     : null;
		let firstName = req.body.hasOwnProperty('firstName') ? req.body.firstName : null;
		let lastName  = req.body.hasOwnProperty('lastName')  ? req.body.lastName  : null;

		request.post('users', {body: {email, firstName, lastName}}, (err, resp) => {
            
            if (!err) {
				res.send(resp);
            }
        });
	});

}