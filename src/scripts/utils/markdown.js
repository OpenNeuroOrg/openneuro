import Remarkable  from 'remarkable';
import linkifyHTML from 'linkifyjs/html';
let md = new Remarkable();

export default {

	/**
	 * format
	 *
	 * Takes a string and return and object with a
	 * _html property with linkified & markdown
	 * rendered html
	 */
    format(value) {
        return {__html: linkifyHTML(md.render(value))};
    }
};