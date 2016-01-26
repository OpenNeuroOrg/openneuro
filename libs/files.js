import config  from '../config';
import fs      from 'fs';
import async   from 'async';

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
    }
}