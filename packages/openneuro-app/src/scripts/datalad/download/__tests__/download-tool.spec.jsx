import React from 'react'
import { shallow } from 'enzyme'
import DownloadTool from '../download-tool.jsx'

const defProps = {
  match: {
    params: {
      datasetId: 'ds000224',
      snapshotId: '1.0.0',
    },
  },
}

describe('dataset/download/DownloadTool', () => {
  it('renders successfully', () => {
    const wrapper = shallow(<DownloadTool {...defProps} />)
    expect(wrapper).toMatchSnapshot()
  })
})
