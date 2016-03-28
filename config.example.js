/**
 * Configuration - Example
 *
 * Update the values and rename this file "config.js"
 */
export default {

	/**
	 * Scitran
	 */
	scitran: {
		url: 'http://url/to/scitran/api/'
	},

	/**
	 * CRN
	 */
	crn: {
		url: 'http://url/to/crn-server/api/'
	},

	/**
	 * Authentication
	 */
	auth: {
		google: {
			clientID: 'your-client-ID.apps.googleusercontent.com'
		}
	},

	/**
	 * Upload
	 */
	upload: {

		/**
		 * Filenames ignored during upload.
		 */
		blacklist: [
		    '.DS_Store',
		    'Icon\r'
		]
	}
};