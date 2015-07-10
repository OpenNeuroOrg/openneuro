/*
 * MD5
 *
 * Takes a file and callsback with a MD5
 * hash. Spawns a web worker to keep
 * hasing off of the UI thread.
 */
export default function (file, callback) {

	var worker = new Worker('md5worker.js');
	worker.postMessage(file);
	worker.onmessage = function (e) {
		console.log(e.data);
	};

}