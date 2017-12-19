import React from 'react'
import { shallow } from 'enzyme'
import DownloadS3 from '../download-s3.jsx'

const dsId = '59c16458c650bd001111f010'
const sId = '3030313030332d3030303031'

describe('dataset/run/DownloadS3', () => {
  it('should render something', () => {
    expect(
      shallow(<DownloadS3 datasetId={dsId} snapshotId={sId} />),
    ).toMatchSnapshot()
  })
})
