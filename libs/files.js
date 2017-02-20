import config  from '../config';
import fs      from 'fs';
import async   from 'async';
import tar     from 'tar-fs';

/**
 * Files
 *
 * A collection of file manipulation methods
 */
export default {

    /**
     * Update symlinks
     *
     * Takes a SciTran BIDS symlink directory and a
     * callback and updates the symlinks to point back
     * to the original files in the scitran file store
     * as defined in the app config.
     */
    updateSymlinks(dir, callback) {
        this.getFiles(dir, (files) => {
            async.each(files, (path, cb) => {
                fs.readlink(path, (err, linkPath) => {
                    fs.unlink(path, () => {
                        fs.symlink(config.scitran.fileStore + '/' + linkPath, path, cb);
                    });
                });
            }, callback);
        });
    },

    /**
     * Get Directory Files
     *
     * Takes a directory and a callback and recurses
     * through the directory to generate an array of
     * paths to every file in the directory.
     */
    getFiles (dir, callback, files_) {
        files_ = files_ || [];
        fs.readdir(dir, (err, files) => {
            async.each(files, (filename, cb) => {
                let path = dir + '/' + filename;
                fs.lstat(path, (err, stats) => {
                    if (stats.isSymbolicLink()) {
                        files_.push(path);
                        cb();
                    } else {
                        this.getFiles(path, () => {
                            cb();
                        }, files_);
                    }
                });
            }, () => {
                callback(files_);
            });
        });
    },

    /**
     * Save Symlinks
     */
    saveSymlinks (hash, body, callback) {
        let persistentPath = __dirname + '/../persistent/';
        fs.writeFile(persistentPath + 'temp/' + hash + '.tar', body, (err) => {
            fs.createReadStream(persistentPath + 'temp/' + hash + '.tar')
                .pipe(tar.extract(persistentPath + 'datasets/', {
                    map: function (header) {
                        let originalDirName = header.name.split('/')[0];
                        header.name = header.name.replace(originalDirName, hash);
                        return header;
                    }
                }))
                .on('finish', () => {
                    fs.unlink(persistentPath + 'temp/' + hash + '.tar', () => {
                        this.updateSymlinks(persistentPath + 'datasets/' + hash, () => {
                            callback(err, hash);
                        });
                    });
                });
        });
    },

    /**
     * Get Content Type
     */
    getContentType(fileName) {
        let contentType = 'application/octet-stream';
        let fn = fileName.toLowerCase();

        let types = {
            '.aac': 'audio/aac',
            '.abw': 'application/x-abiword',
            '.avi': 'video/x-msvideo',
            '.bz': 'application/x-bzip',
            '.bz2': 'application/x-bzip2',
            '.csh': 'application/x-csh',
            '.css': 'text/css',
            '.csv': 'text/csv',
            '.doc': 'application/msword',
            '.epub': 'application/epub+zip',
            '.gif': 'image/gif',
            '.htm': 'text/html',
            '.html': 'text/html',
            '.ico': 'image/x-icon',
            '.ics': 'text/calendar',
            '.jar': 'application/java-archive',
            '.jpeg': 'image/jpeg',
            '.jpg': 'image/jpeg',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.mid': 'audio/midi',
            '.midi': 'audio/midi',
            '.mpeg': 'video/mpeg',
            '.mpkg': 'application/vnd.apple.installer+xml',
            '.odp': 'application/vnd.oasis.opendocument.presentation',
            '.ods': 'application/vnd.oasis.opendocument.spreadsheet',
            '.odt': 'application/vnd.oasis.opendocument.text',
            '.oga': 'audio/ogg',
            '.ogv': 'video/ogg',
            '.ogx': 'application/ogg',
            '.pdf': 'application/pdf',
            '.png': 'image/png',
            '.ppt': 'application/vnd.ms-powerpoint',
            '.rar': 'application/x-rar-compressed',
            '.rtf': 'application/rtf',
            '.sh': 'application/x-sh',
            '.svg': 'image/svg+xml',
            '.swf': 'application/x-shockwave-flash',
            '.tar': 'application/x-tar',
            '.tif': 'image/tiff',
            '.tiff': 'image/tiff',
            '.ttf': 'font/ttf',
            '.wav': 'audio/x-wav',
            '.weba': 'audio/webm',
            '.webm': 'video/webm',
            '.webp': 'image/webp',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
            '.xhtml': 'application/xhtml+xml',
            '.xls': 'application/vnd.ms-excel',
            '.xml': 'application/xml',
            '.zip': 'application/zip'
        };

        for (let type in types) {
            if (fn.endsWith(type)) {
                contentType = types[type];
                break;
            }
        }


        return contentType;
    }

};