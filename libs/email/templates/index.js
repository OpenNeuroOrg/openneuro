import fs    from 'fs';
import _     from 'underscore';

// set template interpolation wrapper to {{}}
_.templateSettings = {
	interpolate: /\{\{(.+?)\}\}/g
};

// generate object of template methods
let templates = {};
let files = fs.readdirSync(__dirname);
for (let file of files) {
	if (file.indexOf('.html') > -1) {
		let tplName = file.slice(0, file.indexOf('.html'));
		let tpl = fs.readFileSync(__dirname + '/' + file).toString('utf-8');
		templates[tplName] = _.template(tpl);
	}
}

export default templates;