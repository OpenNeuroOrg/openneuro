import SparkMD5 from 'spark-md5';

self.addEventListener("message", function(e) {

	let file       = e.data,
        fileReader = new FileReader(),
    	spark      = new SparkMD5.ArrayBuffer();

    fileReader.onload = function (e) {
    	let buffer = e.target.result;
    	spark.append(buffer);
    	let hash = spark.end();
    	postMessage({hash: hash, buffer: buffer});
    }

    fileReader.readAsArrayBuffer(file);

}, false);
