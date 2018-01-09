import React from 'react'
import { shallow } from 'enzyme'
import DownloadAll from '../download-all.jsx'
import WarnButton from '../../../common/forms/warn-button.jsx'
import DownloadS3 from '../download-s3.jsx'
import { successful_run } from './index.spec.js'

describe('dataset/run/DownloadAll', () => {
  it('should render something', () => {
    expect(shallow(<DownloadAll run={successful_run} />)).toMatchSnapshot()
  })
  it('should render a WarnButton for downloading via the web', () => {
    expect(
      shallow(<DownloadAll run={successful_run} />).find(WarnButton).length,
    ).toBe(1)
  })
  it('should render a DownloadS3 component for downloading via AWS cli', () => {
    expect(
      shallow(<DownloadAll run={successful_run} />).find(DownloadS3).length,
    ).toBe(1)
  })
})
