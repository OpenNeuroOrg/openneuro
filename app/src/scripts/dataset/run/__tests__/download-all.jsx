import React from 'react'
import { shallow } from 'enzyme'
import DownloadAll from '../download-all.jsx'

describe('dataset/run/DownloadAll', () => {
  it('should render something', () => {
    expect(shallow(<DownloadAll />)).toMatchSnapshot()
  })
})
