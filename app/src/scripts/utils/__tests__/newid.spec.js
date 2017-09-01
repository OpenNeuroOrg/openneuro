import assert from 'assert';
import newid  from '../newid';

describe('utils/newid.js', () => {

    it('should iterate a new id every time it\'s called', () => {
        assert.equal(newid(), 'id1');
        assert.equal(newid(), 'id2');
        assert.equal(newid(), 'id3');
    });

    it('should accept an id prefix to replace the generic "id"', () => {
        assert.equal(newid('my-prefix-'), 'my-prefix-1');
        assert.equal(newid('my-prefix-'), 'my-prefix-2');
        assert.equal(newid('my-prefix-'), 'my-prefix-3');
    });

});