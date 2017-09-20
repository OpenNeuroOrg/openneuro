import assert from 'assert'
import files from '../files'

describe('utils/files.js', () => {
  // mocks -----------------------------------------------------------------------------------------

  let fileList = [
    {
      name: 'dataset_description.json',
      webkitRelativePath: 'ds000/dataset_description.json',
    },
    {
      name: 'participants.tsv',
      webkitRelativePath: 'ds000/participants.tsv',
    },
    {
      name: 'README',
      webkitRelativePath: 'ds000/README',
    },
    {
      name: 'task-balloonanalogrisktask_bold.json',
      webkitRelativePath: 'ds000/task-balloonanalogrisktask_bold.json',
    },
    {
      name: 'sub-01_ses-01_task-balloonanalogrisktask_run-01_bold.nii.gz',
      webkitRelativePath:
        'ds000/sub-01/ses-01/func/sub-01_ses-01_task-balloonanalogrisktask_run-01_bold.nii.gz',
    },
    {
      name: 'sub-01_ses-01_task-balloonanalogrisktask_run-01_events.tsv',
      webkitRelativePath:
        'ds000/sub-01/ses-01/func/sub-01_ses-01_task-balloonanalogrisktask_run-01_events.tsv',
    },
    {
      name: 'sub-01_ses-01_inplaneT2.nii.gz',
      webkitRelativePath:
        'ds000/sub-01/ses-01/anat/sub-01_ses-01_inplaneT2.nii.gz',
    },
    {
      name: 'sub-01_ses-01_T1w.nii.gz',
      webkitRelativePath: 'ds000/sub-01/ses-01/anat/sub-01_ses-01_T1w.nii.gz',
    },
  ]

  let fileTree = [
    {
      _id: 'folder-1',
      dirPath: 'ds000/',
      name: 'ds000',
      type: 'folder',
      children: [
        {
          name: 'dataset_description.json',
          webkitRelativePath: 'ds000/dataset_description.json',
          _id: 'file-1',
          parentId: 'folder-1',
        },
        {
          name: 'participants.tsv',
          webkitRelativePath: 'ds000/participants.tsv',
          _id: 'file-2',
          parentId: 'folder-1',
        },
        {
          name: 'README',
          webkitRelativePath: 'ds000/README',
          _id: 'file-3',
          parentId: 'folder-1',
        },
        {
          name: 'task-balloonanalogrisktask_bold.json',
          webkitRelativePath: 'ds000/task-balloonanalogrisktask_bold.json',
          _id: 'file-4',
          parentId: 'folder-1',
        },
        {
          _id: 'folder-2',
          dirPath: 'ds000/sub-01/',
          name: 'sub-01',
          type: 'folder',
          children: [
            {
              _id: 'folder-3',
              dirPath: 'ds000/sub-01/ses-01/',
              name: 'ses-01',
              type: 'folder',
              children: [
                {
                  _id: 'folder-5',
                  dirPath: 'ds000/sub-01/ses-01/anat/',
                  name: 'anat',
                  type: 'folder',
                  children: [
                    {
                      name: 'sub-01_ses-01_inplaneT2.nii.gz',
                      webkitRelativePath:
                        'ds000/sub-01/ses-01/anat/sub-01_ses-01_inplaneT2.nii.gz',
                      _id: 'file-7',
                      parentId: 'folder-5',
                    },
                    {
                      name: 'sub-01_ses-01_T1w.nii.gz',
                      webkitRelativePath:
                        'ds000/sub-01/ses-01/anat/sub-01_ses-01_T1w.nii.gz',
                      _id: 'file-8',
                      parentId: 'folder-5',
                    },
                  ],
                },
                {
                  _id: 'folder-4',
                  dirPath: 'ds000/sub-01/ses-01/func/',
                  name: 'func',
                  type: 'folder',
                  children: [
                    {
                      name:
                        'sub-01_ses-01_task-balloonanalogrisktask_run-01_bold.nii.gz',
                      webkitRelativePath:
                        'ds000/sub-01/ses-01/func/sub-01_ses-01_task-balloonanalogrisktask_run-01_bold.nii.gz',
                      _id: 'file-5',
                      parentId: 'folder-4',
                    },
                    {
                      name:
                        'sub-01_ses-01_task-balloonanalogrisktask_run-01_events.tsv',
                      webkitRelativePath:
                        'ds000/sub-01/ses-01/func/sub-01_ses-01_task-balloonanalogrisktask_run-01_events.tsv',
                      _id: 'file-6',
                      parentId: 'folder-4',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ]

  // tests -----------------------------------------------------------------------------------------

  it('should generate a tree structure from a selection of files', () => {
    assert.deepEqual(files.generateTree(fileList), fileTree)
  })

  it('should return the tree element with the corresponding id', () => {
    let elem = files.findInTree(fileTree, 'folder-5')
    let mockElem = {
      _id: 'folder-5',
      dirPath: 'ds000/sub-01/ses-01/anat/',
      name: 'anat',
      type: 'folder',
      children: [
        {
          name: 'sub-01_ses-01_inplaneT2.nii.gz',
          webkitRelativePath:
            'ds000/sub-01/ses-01/anat/sub-01_ses-01_inplaneT2.nii.gz',
          _id: 'file-7',
          parentId: 'folder-5',
        },
        {
          name: 'sub-01_ses-01_T1w.nii.gz',
          webkitRelativePath:
            'ds000/sub-01/ses-01/anat/sub-01_ses-01_T1w.nii.gz',
          _id: 'file-8',
          parentId: 'folder-5',
        },
      ],
    }
    assert.deepEqual(elem, mockElem)
  })
})
