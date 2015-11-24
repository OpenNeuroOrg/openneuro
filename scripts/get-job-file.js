import agave from '../libs/agave';
import fs from 'fs';

agave.getFile(process.argv[2], (err, res) => {
	// console.log(JSON.stringify(res.body));
	console.log(res.req.path);
	fs.writeFile('output.pdf', res.body, function (err) {
		console.log(err);
		console.log('finished');
	});
});