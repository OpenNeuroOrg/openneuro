/*
 * MD5
 *
 * Takes a file and callsback with a MD5
 * hash and a file array buffer. Spawns a web worker to keep
 * hashing off of the UI thread.
 */
export default function (file, callback) {

	var worker = new Worker('md5worker.js');
	worker.postMessage(file);
	worker.onmessage = function (e) {
		callback(e.data);
	};

}