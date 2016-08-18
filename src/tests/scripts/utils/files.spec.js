import assert from 'assert';
import files  from '../../../scripts/utils/files';
import newid  from '../../../scripts/utils/newid';

describe('utils/files.js', () => {

// mocks -----------------------------------------------------------------------------------------

    let fileList = [
        {
            name: 'dataset_description.json',
            webkitRelativePath: 'ds000/dataset_description.json'
        },
        {
            name: 'participants.tsv',
            webkitRelativePath: 'ds000/participants.tsv'
        },
        {
            name: 'README',
            webkitRelativePath: 'ds000/README'
        },
        {
            name: 'task-balloonanalogrisktask_bold.json',
            webkitRelativePath: 'ds000/task-balloonanalogrisktask_bold.json'
        },
        {
            name: 'sub-01_ses-01_task-balloonanalogrisktask_run-01_bold.nii.gz',
            webkitRelativePath: 'ds000/sub-01/ses-01/func/sub-01_ses-01_task-balloonanalogrisktask_run-01_bold.nii.gz'
        },
        {
            name: 'sub-01_ses-01_task-balloonanalogrisktask_run-01_events.tsv',
            webkitRelativePath: 'ds000/sub-01/ses-01/func/sub-01_ses-01_task-balloonanalogrisktask_run-01_events.tsv'
        },
        {
            name: 'sub-01_ses-01_inplaneT2.nii.gz',
            webkitRelativePath: 'ds000/sub-01/ses-01/anat/sub-01_ses-01_inplaneT2.nii.gz'
        },
        {
            name: 'sub-01_ses-01_T1w.nii.gz',
            webkitRelativePath: 'ds000/sub-01/ses-01/anat/sub-01_ses-01_T1w.nii.gz'
        }
    ];

    let fileTree = [
        {
            'name': 'ds000',
            'type': 'folder',
            'children': [
                {
                    'name': 'dataset_description.json',
                    'webkitRelativePath': 'ds000/dataset_description.json'
                },
                {
                    'name': 'participants.tsv',
                    'webkitRelativePath': 'ds000/participants.tsv'
                },
                {
                    'name': 'README',
                    'webkitRelativePath': 'ds000/README'
                },
                {
                    'name': 'task-balloonanalogrisktask_bold.json',
                    'webkitRelativePath': 'ds000/task-balloonanalogrisktask_bold.json'
                },
                {
                    'name': 'sub-01',
                    'type': 'folder',
                    'children': [
                        {
                            'name': 'ses-01',
                            'type': 'folder',
                            'children': [
                                {
                                    'name': 'func',
                                    'type': 'folder',
                                    'children': [
                                        {
                                            'name': 'sub-01_ses-01_task-balloonanalogrisktask_run-01_bold.nii.gz',
                                            'webkitRelativePath': 'ds000/sub-01/ses-01/func/sub-01_ses-01_task-balloonanalogrisktask_run-01_bold.nii.gz'
                                        },
                                        {
                                            'name': 'sub-01_ses-01_task-balloonanalogrisktask_run-01_events.tsv',
                                            'webkitRelativePath': 'ds000/sub-01/ses-01/func/sub-01_ses-01_task-balloonanalogrisktask_run-01_events.tsv'
                                        }
                                    ]
                                },
                                {
                                    'name': 'anat',
                                    'type': 'folder',
                                    'children': [
                                        {
                                            'name': 'sub-01_ses-01_inplaneT2.nii.gz',
                                            'webkitRelativePath': 'ds000/sub-01/ses-01/anat/sub-01_ses-01_inplaneT2.nii.gz'
                                        },
                                        {
                                            'name': 'sub-01_ses-01_T1w.nii.gz',
                                            'webkitRelativePath': 'ds000/sub-01/ses-01/anat/sub-01_ses-01_T1w.nii.gz'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ];

// helper functions ------------------------------------------------------------------------------

    function addIds(tree) {
        function recurse (tree) {
            for (let item of tree) {
                item._id = newid('tree-');
                if (item.children) {recurse(item.children);}
            }
        }
        recurse(tree);
        return tree;
    }

// tests -----------------------------------------------------------------------------------------

    it('should generate a tree structure from a selection of files', () => {
        assert.deepEqual(files.generateTree(fileList), fileTree);
    });

    it('should return the combined number of files and folders in a dataset tree', () => {
        assert.equal(files.countTree(fileTree), 13);
    });

    it('should return the tree element with the corresponding id', () => {
        let idTree = addIds(fileTree);
        let elem = files.findInTree(idTree, 'tree-11');
        let mockElem = {
            'name': 'anat',
            'type': 'folder',
            'children': [
                {
                    'name': 'sub-01_ses-01_inplaneT2.nii.gz',
                    'webkitRelativePath': 'ds000/sub-01/ses-01/anat/sub-01_ses-01_inplaneT2.nii.gz',
                    '_id': 'tree-12'
                },
                {
                    'name': 'sub-01_ses-01_T1w.nii.gz',
                    'webkitRelativePath': 'ds000/sub-01/ses-01/anat/sub-01_ses-01_T1w.nii.gz',
                    '_id': 'tree-13'
                }
            ],
            '_id': 'tree-11'
        };
        assert.deepEqual(elem,  mockElem);
    });

});