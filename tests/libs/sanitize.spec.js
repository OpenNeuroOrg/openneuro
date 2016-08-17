var assert   = require('assert');
var sanitize = require('../../libs/sanitize');

describe('libs/sanitize.js', () => {

    it('should return an allowed request body unchanged', () => {
        var request = {
            body: {
                id:        'example-id',
                firstname: 'John',
                lastname:  'Doe',
                superuser: false,
                tags:      ['one', 'two', 'three']
            }
        };
        var model = {
            id:        'string, required',
            firstname: 'string, required',
            lastname:  'string, required',
            superuser: 'boolean, required',
            tags:      'object, required'
        };
        sanitize.req(request, model, (err, res) => {
            assert.equal(err, null);
            assert.deepEqual(request.body, res);
        });
    });

    it('should allow specified but non-required properties', () => {
        var model = {
            id:        'string, required',
            firstname: 'string, required',
            lastname:  'string, required',
            superuser: 'boolean, required',
            tags:      'object'
        };

        // request with optional property
        var request = {
            body: {
                id:        'example-id',
                firstname: 'John',
                lastname:  'Doe',
                superuser: false,
                tags:      ['one', 'two', 'three']
            }
        };
        sanitize.req(request, model, (err, res) => {
            assert.equal(err, null);
            assert.deepEqual(request.body, res);
        });

        // request without optional property
        request = {
            body: {
                id:        'example-id',
                firstname: 'John',
                lastname:  'Doe',
                superuser: false
            }
        };
        sanitize.req(request, model, (err, res) => {
            assert.equal(err, null);
            assert.deepEqual(request.body, res);
        });
    });

    it('should typecheck non-required properties', () => {
        var model = {
            id:        'string, required',
            firstname: 'string, required',
            lastname:  'string, required',
            superuser: 'boolean, required',
            tags:      'object'
        };

        // request with optional property
        var request = {
            body: {
                id:        'example-id',
                firstname: 'John',
                lastname:  'Doe',
                superuser: false,
                tags:      '[\'one\', \'two\', \'three\']'
            }
        };
        sanitize.req(request, model, (err) => {
            assert.notEqual(err, null);
            assert.equal(err.message, 'tags must be an object.');
        });
    });

    it('should strip properties not in the model', () => {
        var request = {
            body: {
                id:        'example-id',
                firstname: 'John',
                lastname:  'Doe',
                superuser: false,
                tags:      ['one', 'two', 'three']
            }
        };
        var sanitized = {
            body: {
                firstname: 'John',
                lastname:  'Doe'
            }
        };
        var model = {
            firstname: 'string, required',
            lastname:  'string, required'
        };
        sanitize.req(request, model, (err, res) => {
            assert.equal(err, 'null');
            assert.deepEqual(sanitized.body, res);
        });
    });

    it('should not allow properties of incorrect type', () => {
        var request = {
            body: {
                firstname: 'John',
                lastname:  'Doe',
                superuser: 'false'
            }
        };
        var model = {
            firstname: 'string, required',
            lastname:  'string, required',
            superuser: 'boolean, required'
        };
        sanitize.req(request, model, (err) => {
            assert.notEqual(err, null);
            assert.equal(err.message, 'superuser must be a boolean.');
        });
    });

});