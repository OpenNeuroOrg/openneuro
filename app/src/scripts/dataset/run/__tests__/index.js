import React from 'react'
import { shallow } from 'enzyme'
import JobAccordion from '../index'

const successful_run = {
  _id: '59c1632cc650bd001111f00d',
  datasetId: '202020206473303031303033',
  datasetLabel: 'DS003-downsampled (only T1)',
  jobDefinition:
    'arn:aws:batch:us-east-1:488777458602:job-definition/bids-example-nell:7',
  jobName: 'bids-example-nell',
  parameters: { participant_label: ['13'] },
  snapshotId: '3030313030332d3030303031',
  userId: 'nell@squishymedia.com',
  uploadSnapshotComplete: true,
  analysis: {
    analysisId: 'dcedf0c3-4438-466d-9f85-61c75275b355',
    status: 'SUCCEEDED',
    created: '2017-09-19T18:34:20.179Z',
    attempts: 1,
    notification: true,
    jobs: [
      '53f77df6-588e-4708-bfa0-5909b3c6c47f',
      '855fb131-e50d-4a75-97b5-edff18968307',
    ],
    batchStatus: [
      {
        status: 'SUCCEEDED',
        job: '53f77df6-588e-4708-bfa0-5909b3c6c47f',
      },
      { status: 'SUCCEEDED', job: '855fb131-e50d-4a75-97b5-edff18968307' },
    ],
    statusAge: '2017-09-19T18:48:40.117Z',
    logstreams: [
      {
        name: 'bids-example-nell/default/5c35f0d9-1ff1-49fa-b7a7-0175a53ef4ca',
        environment: [
          { name: 'BIDS_OUTPUT_BUCKET', value: 'openneuro.outputs' },
          {
            name: 'BIDS_DATASET_BUCKET',
            value: 'openneuro.snapshots',
          },
          { name: 'BIDS_ANALYSIS_LEVEL', value: 'participant' },
          { name: 'BIDS_CONTAINER', value: 'bids/example:0.0.6' },
          {
            name: 'BIDS_ANALYSIS_ID',
            value: 'dcedf0c3-4438-466d-9f85-61c75275b355',
          },
          {
            name: 'BIDS_SNAPSHOT_ID',
            value: 'cf02b5bf17df80d056effadccffd65bd',
          },
          { name: 'BIDS_ARGUMENTS', value: '--participant_label 13' },
          { name: 'BIDS_INPUT_BUCKET', value: 'openneuro.inputs' },
        ],
        exitCode: 0,
      },
      {
        name: 'bids-example-nell/default/eb40a865-750c-4f91-b71e-c4b9ed90ccae',
        environment: [
          { name: 'BIDS_OUTPUT_BUCKET', value: 'openneuro.outputs' },
          {
            name: 'BIDS_DATASET_BUCKET',
            value: 'openneuro.snapshots',
          },
          { name: 'BIDS_ANALYSIS_LEVEL', value: 'group' },
          { name: 'BIDS_CONTAINER', value: 'bids/example:0.0.6' },
          {
            name: 'BIDS_ANALYSIS_ID',
            value: 'dcedf0c3-4438-466d-9f85-61c75275b355',
          },
          {
            name: 'BIDS_SNAPSHOT_ID',
            value: 'cf02b5bf17df80d056effadccffd65bd',
          },
          { name: 'BIDS_ARGUMENTS', value: '--participant_label 13' },
          { name: 'BIDS_INPUT_BUCKET', value: 'openneuro.inputs' },
        ],
        exitCode: 0,
      },
    ],
  },
  appLabel: 'bids-example-nell',
  appVersion: '7',
  datasetHash: 'cf02b5bf17df80d056effadccffd65bd',
  parametersHash: '5426923f600d855dd0c423a10a341640',
  results: [
    {
      type: 'file',
      dirPath: 'avg_brain_size.txt',
      name: 'avg_brain_size.txt',
      path:
        'openneuro.outputs/cf02b5bf17df80d056effadccffd65bd/dcedf0c3-4438-466d-9f85-61c75275b355/avg_brain_size.txt',
    },
    {
      type: 'file',
      dirPath: 'sub-13_brain.nii.gz',
      name: 'sub-13_brain.nii.gz',
      path:
        'openneuro.outputs/cf02b5bf17df80d056effadccffd65bd/dcedf0c3-4438-466d-9f85-61c75275b355/sub-13_brain.nii.gz',
    },
  ],
  active: true,
}

const failed_run = {
  _id: '59c16458c650bd001111f010',
  datasetId: '202020206473303031303033',
  datasetLabel: 'DS003-downsampled (only T1)',
  jobDefinition:
    'arn:aws:batch:us-east-1:488777458602:job-definition/bids-example-nell:7',
  jobName: 'bids-example-nell',
  parameters: { participant_label: ['07'] },
  snapshotId: '3030313030332d3030303031',
  userId: 'nell@squishymedia.com',
  uploadSnapshotComplete: true,
  analysis: {
    analysisId: 'a2e4e221-a671-415a-bd0f-b7fdd44cea14',
    status: 'FAILED',
    created: '2017-09-19T18:39:20.385Z',
    attempts: 1,
    notification: true,
    jobs: [
      '49c03ed3-281e-40d3-b027-3102dcb5153c',
      'e276c571-83f7-439f-a34c-09840bb2a9cd',
    ],
    batchStatus: [
      { status: 'FAILED', job: '49c03ed3-281e-40d3-b027-3102dcb5153c' },
      { status: 'FAILED', job: 'e276c571-83f7-439f-a34c-09840bb2a9cd' },
    ],
    statusAge: '2017-09-19T18:47:00.093Z',
    logstreams: [],
  },
  appLabel: 'bids-example-nell',
  appVersion: '7',
  datasetHash: 'cf02b5bf17df80d056effadccffd65bd',
  parametersHash: '75e27e50b5d846730740410875649318',
  results: [],
  active: true,
}

const props = {
  toggleFolder: jest.fn(),
  displayFile: jest.fn(),
  currentUser: 'nell@squishymedia.com',
}

describe('dataset/dataset/run/JobAccordion', () => {
  it('renders a successful run', () => {
    const wrapper = shallow(
      <JobAccordion
        run={successful_run}
        toggleFolder={props.toggleFolder}
        displayFile={props.displayFile}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('renders a failed run', () => {
    const wrapper = shallow(<JobAccordion run={failed_run} />)
    expect(wrapper).toMatchSnapshot()
  })
})
