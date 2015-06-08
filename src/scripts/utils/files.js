let fileUtils = {

	/**
	 * Read
	 *
	 * A helper method for reading file contents.
	 * Takes a file object and a callback and calls
	 * the callback with the binary contents of the
	 * file as the only argument.
	 */
	read (file, callback) {
		var reader = new FileReader();
		reader.onloadend = function (e) {
			if (e.target.readyState == FileReader.DONE) {
				callback(e.target.result);
			}
		};
		reader.readAsBinaryString(file);
	}

};

export default fileUtils;