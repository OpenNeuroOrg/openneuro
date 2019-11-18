import React from 'react'
import { shallow } from 'enzyme'
import DownloadLink from '../download-link.jsx'

const defProps = {
  datasetId: 'ds000001',
  snapshotTag: '1.0.0',
}

describe('dataset/download/DownloadLink', () => {
  it('renders successfully', () => {
    const wrapper = shallow(<DownloadLink {...defProps} />)
    expect(wrapper).toMatchSnapshot()
  })
})
