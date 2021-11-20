import React from 'react'
import { shallow } from 'enzyme'
import { DownloadSampleCommand } from '../download-command-line.jsx'

const defProps = { datasetId: 'ds000001' }

describe('dataset/download', () => {
  describe('DownloadSampleCommand component', () => {
    it('renders successfully', () => {
      const wrapper = shallow(<DownloadSampleCommand {...defProps} />)
      expect(wrapper).toMatchSnapshot()
    })
    it('drafts show draft flag', () => {
      const wrapper = shallow(<DownloadSampleCommand {...defProps} />)
      expect(wrapper.text()).toEqual(expect.stringContaining('--draft'))
      expect(wrapper.text()).toEqual(expect.not.stringContaining('--snapshot'))
    })
    it('snapshots show snapshot flag', () => {
      const wrapper = shallow(
        <DownloadSampleCommand {...defProps} snapshotTag="1.0.0" />,
      )
      expect(wrapper.text()).toEqual(expect.stringContaining('--snapshot'))
      expect(wrapper.text()).toEqual(expect.not.stringContaining('--draft'))
    })
  })
})
