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
                        fs.symlink(config.scitran.fileStore + linkPath, path, cb);
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
                        this.getFiles(path, (files) => {
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
        fs.writeFile('./persistent/temp/' + hash + '.tar', body, (err) => {
            fs.createReadStream('./persistent/temp/' + hash + '.tar')
                .pipe(tar.extract('./persistent/datasets/', {
                    map: function (header) {
                        let originalDirName = header.name.split('/')[0];
                        header.name = header.name.replace(originalDirName, hash);
                        return header;
                    }
                }))
                .on('finish', () => {
                    fs.unlink('./persistent/temp/' + hash + '.tar', () => {
                        this.updateSymlinks('./persistent/datasets/' + hash, () => {
                            callback(err, hash);
                        });
                    });
                });
        });
    }

}