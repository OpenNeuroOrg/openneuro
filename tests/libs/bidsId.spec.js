var assert   = require('assert');
var bidsId = require('../../libs/bidsId');

describe('libs/bidsId.js', () => {

    it('should decode hex strings to ASCII', () => {
        assert.equal(bidsId.hexToASCII('202020206473303030313437'), '    ds000147');
    });


    it('should encode ASCII strings to hex', () => {
        assert.equal(bidsId.hexFromASCII('    ds000147'), '202020206473303030313437');
    });

    it('should decode hex BIDS IDs to ASCII', () => {
        assert.equal(bidsId.decodeId('202020206473303030313437'), 'ds000147');
    });

    it('should encode BIDS IDs', () => {
        assert.equal(bidsId.encodeId('ds000147'), '202020206473303030313437');
    });


});