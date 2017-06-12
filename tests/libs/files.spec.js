var assert = require('assert');
var files  = require('../../libs/files');

describe('libs/files.js', () => {

    describe('getContentType()', () => {
        it('should return the file\'s content type', () => {
            let types = {
                'song.aac': 'audio/aac',
                'document.abw': 'application/x-abiword',
                'video.avi': 'video/x-msvideo',
                'myfile.bz': 'application/x-bzip',
                'myfile.bz2': 'application/x-bzip2',
                'file.csh': 'application/x-csh',
                'styles.css': 'text/css',
                'table.csv': 'text/csv',
                'report.doc': 'application/msword',
                'story.epub': 'application/epub+zip',
                'meme.gif': 'image/gif',
                'index.htm': 'text/html',
                'root.html': 'text/html',
                'favicon.ico': 'image/x-icon',
                'meeting.ics': 'text/calendar',
                'project.jar': 'application/java-archive',
                'result.jpeg': 'image/jpeg',
                'result.jpg': 'image/jpeg',
                'script.js': 'application/javascript',
                'data.json': 'application/json',
                'song.mid': 'audio/midi',
                'song.midi': 'audio/midi',
                'video.mpeg': 'video/mpeg',
                'install.mpkg': 'application/vnd.apple.installer+xml',
                'document.odp': 'application/vnd.oasis.opendocument.presentation',
                'document.ods': 'application/vnd.oasis.opendocument.spreadsheet',
                'document.odt': 'application/vnd.oasis.opendocument.text',
                'message.oga': 'audio/ogg',
                'display.ogv': 'video/ogg',
                'document.ogx': 'application/ogg',
                'document.pdf': 'application/pdf',
                'image.png': 'image/png',
                'report.ppt': 'application/vnd.ms-powerpoint',
                'archive.my-stuff.rar': 'application/x-rar-compressed',
                'document.rtf': 'application/rtf',
                'run.sh': 'application/x-sh',
                'design.svg': 'image/svg+xml',
                'game.swf': 'application/x-shockwave-flash',
                'archive24452.tar': 'application/x-tar',
                'asdfasdf.tif': 'image/tiff',
                '13344.tiff': 'image/tiff',
                '51451.ttf': 'font/ttf',
                'sound.wav': 'audio/x-wav',
                'video.weba': 'audio/webm',
                'video.webm': 'video/webm',
                'picture.webp': 'image/webp',
                'font.woff': 'font/woff',
                'font.woff2': 'font/woff2',
                'document.xhtml': 'application/xhtml+xml',
                'spreedsheet3.xls': 'application/vnd.ms-excel',
                'document.xml': 'application/xml',
                'directory.zip': 'application/zip'
            };
            for (let type in types) {
                assert.equal(files.getContentType(type), types[type]);
            }
        });
    });
});