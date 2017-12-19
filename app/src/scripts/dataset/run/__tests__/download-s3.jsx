import React from 'react'
import { shallow } from 'enzyme'
import DownloadS3 from '../download-s3.jsx'

const datasetHash = 'dataset-hash'
const analysisId = 'analysis-id'

// Mock the needed configuration
jest.mock('../../../../../config', () => {
  return {
    aws: {
      s3: {
        analysisBucket: 'test-bucket',
      },
    },
  }
})

describe('dataset/run/DownloadS3', () => {
  it('should render something', () => {
    expect(
      shallow(<DownloadS3 datasetHash={datasetHash} analysisId={analysisId} />),
    ).toMatchSnapshot()
  })
  it('opens a new window when the download link is clicked', () => {
    global.open = jest.fn()
    const preventDefault = jest.fn()
    const wrapper = shallow(
      <DownloadS3 datasetHash={datasetHash} analysisId={analysisId} />,
    )
    const s3Link = wrapper.find('a')
    s3Link.simulate('click', { preventDefault })
    expect(preventDefault).toHaveBeenCalled()
    expect(global.open).toHaveBeenCalledWith(
      's3://test-bucket/dataset-hash/analysis-id',
      'S3',
    )
  })
})
