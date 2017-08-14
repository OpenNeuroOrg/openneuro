var assert   = require('assert');
var aws = require('../../libs/aws');

const subjectParam = {participant_label: ['01', '02', '03']};
const nCpusParam = {n_cpus: 4};
const templateNameParam = {template_name: 'template1'};
const emptyParam = {template_name: []};
const nullParam = {template_name: null};
const spaceParam = {license_key: 'Super Secret Shhhhhh', cartoons: ['Ren and Stimpy']};

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
        it('should properly format string arguments with spaces', () => {
            let params = Object.assign({}, subjectParam, spaceParam);
            let args = aws.batch._prepareArguments(params);
            assert.equal(args, '--participant_label 01 02 03 --license_key \'Super Secret Shhhhhh\' --cartoons \'Ren and Stimpy\'');
        });
    });
    describe('_partitionLabels()', () => {
        it('should produce 3 expected groupings from 3 labels', () => {
            let labels = [ ...Array(3).keys() ];
            assert.deepEqual(aws.batch._partitionLabels(labels), [[0], [1], [2]]);
        });
        it('should produce 20 expected groupings from 23 labels', () => {
            let labels = [ ...Array(23).keys() ];
            let res = aws.batch._partitionLabels(labels);
            assert.deepEqual(res, [[0, 20], [1, 21], [2, 22], [3], [4], [5], [6], [7], [8], [9], [10], [11], [12], [13], [14], [15], [16], [17], [18], [19]]);
        });
        it('should limit 10 labels to 10 groups', () => {
            let labels = [ ...Array(10).keys() ];
            assert.equal(aws.batch._partitionLabels(labels).length, 10);
        });
        it('should limit 25 labels to 20 groups', () => {
            let labels = [ ...Array(25).keys() ];
            assert.equal(aws.batch._partitionLabels(labels).length, 20);
        });
        it('should limit 40 labels to 20 groups', () => {
            let labels = [ ...Array(40).keys() ];
            assert.equal(aws.batch._partitionLabels(labels).length, 20);
        });
        it('should limit 250 labels to 20 groups', () => {
            let labels = [ ...Array(250).keys() ];
            assert.equal(aws.batch._partitionLabels(labels).length, 20);
        });
        it('should limit 1 label to 1 group', () => {
            let labels = [ '0' ];
            assert.equal(aws.batch._partitionLabels(labels).length, 1);
        });
        it('should return 0 groups for 0 labels', () => {
            let labels = [ ];
            assert.equal(aws.batch._partitionLabels(labels).length, 0);
        });
        it('should partition labels into +/- 1 item size groups', () => {
            let labels = [ ...Array(250).keys() ];
            let groups = aws.batch._partitionLabels(labels);
            let lengths = groups.map((group) => {
                return group.length;
            });
            assert.equal((Math.max(...lengths) - Math.min(...lengths)), 1);
        });
    });
});
