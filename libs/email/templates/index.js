import fs from 'fs';

// generate template list
let templates = {};
let files = fs.readdirSync(__dirname);
for (let file of files) {
	if (file.indexOf('.html') > -1) {
		let tplName = file.slice(0, file.indexOf('.html'));
		let tpl = fs.readFileSync(__dirname + '/' + file).toString('utf-8');
		templates[tplName] = tpl;
	}
}

export default templates;