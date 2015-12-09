import SparkMD5 from 'spark-md5';

self.addEventListener("message", function(e) {
    if (e.data.request !== 'postUri') {

        let file = e.data;

        // immediately hash files that have already been read
        if (file.data) {
            postMessage({hash: SparkMD5.hash(file.data)});
            return;
        }

        let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
            chunkSize = 2097152, // Read in chunks of 2MB
            chunks = Math.ceil(file.size / chunkSize),
            currentChunk = 0,
            spark = new SparkMD5.ArrayBuffer(),
            fileReader = new FileReader();

        fileReader.onload = function (e) {
            spark.append(e.target.result);
            currentChunk++;

            if (currentChunk < chunks) {
                loadNext();
            } else {
                let hash = spark.end();
                postMessage({hash});
            }

        };

        fileReader.onerror = function (e) {
           postMessage(e);
        };

        function loadNext() {
            let start = currentChunk * chunkSize,
            end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
            fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }

        loadNext();

    }
}, false);
