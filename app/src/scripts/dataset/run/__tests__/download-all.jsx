import React from 'react'
import { shallow } from 'enzyme'
import DownloadAll from '../download-all.jsx'
import WarnButton from '../../../common/forms/warn-button.jsx'
import DownloadS3 from '../download-s3.jsx'

const dsId = '59c16458c650bd001111f010'
const sId = '3030313030332d3030303031'

describe('dataset/run/DownloadAll', () => {
  it('should render something', () => {
    expect(
      shallow(<DownloadAll datasetId={dsId} snapshotId={sId} />),
    ).toMatchSnapshot()
  })
  it('should render a WarnButton for downloading via the web', () => {
    expect(
      shallow(<DownloadAll datasetId={dsId} snapshotId={sId} />).find(
        WarnButton,
      ).length,
    ).toBe(1)
  })
  it('should render a DownloadS3 component for downloading via AWS cli', () => {
    expect(
      shallow(<DownloadAll datasetId={dsId} snapshotId={sId} />).find(
        DownloadS3,
      ).length,
    ).toBe(1)
  })
})
