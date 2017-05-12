var assert   = require('assert');
var aws = require('../../libs/aws');

const subjectParam = {participant_label: ['01', '02', '03']};
const nCpusParam = {n_cpus: 4};
const templateNameParam = {template_name: 'template1'};
const emptyParam = {template_name: []};
const nullParam = {template_name: null};

describe('libs/aws/batch.js', () => {
    describe('_prepareArguments()', () => {
        it('should return a valid list argument', () => {
            let params = Object.assign({}, subjectParam);
            let args = aws.batch._prepareArguments(params);
            assert.equal(args, '--participant_label 01 02 03');
        });
        it('should return a valid string argument', () => {
            let params =  Object.assign({}, templateNameParam);
            let args = aws.batch._prepareArguments(params);
            assert.equal(args, '--template_name template1');
        });
        it('should return a valid numeric argument', () => {
            let params = Object.assign({}, nCpusParam);
            let args = aws.batch._prepareArguments(params);
            assert.equal(args, '--n_cpus 4');
        });
        it('should combine multiple arguments', () => {
            let params = Object.assign({}, subjectParam, nCpusParam);
            let args = aws.batch._prepareArguments(params);
            assert.equal(args, '--participant_label 01 02 03 --n_cpus 4');
        });
        it('should not include empty list parameters', () => {
            let params = Object.assign({}, subjectParam, nCpusParam, emptyParam);
            let args = aws.batch._prepareArguments(params);
            assert.equal(args, '--participant_label 01 02 03 --n_cpus 4');
        });
        it('should not include null parameters', () => {
            let params = Object.assign({}, subjectParam, nCpusParam, nullParam);
            let args = aws.batch._prepareArguments(params);
            assert.equal(args, '--participant_label 01 02 03 --n_cpus 4');
        });
    });
});
