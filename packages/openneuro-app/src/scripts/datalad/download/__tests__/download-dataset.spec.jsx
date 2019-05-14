import React from 'react'
import { shallow } from 'enzyme'
import DownloadDataset from '../download-dataset.jsx'

const defProps = {
  match: {
    params: {
      datasetId: 'ds000224',
      snapshotId: '1.0.0',
    },
  },
}

describe('dataset/download/DownloadDataset', () => {
  it('renders successfully', () => {
    const wrapper = shallow(<DownloadDataset {...defProps} />)
    expect(wrapper).toMatchSnapshot()
  })
})
