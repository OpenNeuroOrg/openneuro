import React from 'react'
import { shallow } from 'enzyme'
import File from '../file.jsx'

describe('File component', () => {
  it('renders with common props', () => {
    expect(
      shallow(<File datasetId="ds001" path="" filename="README" />),
    ).toMatchSnapshot()
  })
  it('renders for dataset snapshots', () => {
    expect(
      shallow(
        <File
          datasetId="ds001"
          snapshotTag="1.0.0"
          path=""
          filename="README"
        />,
      ),
    ).toMatchSnapshot()
  })
  it('generates correct download links for top level files', () => {
    const wrapper = shallow(
      <File datasetId="ds001" path="" filename="README" />,
    )
    expect(wrapper.find('.download-file > a').prop('href')).toEqual(
      '/crn/datasets/ds001/files/README',
    )
  })
  it('generates correct download links for nested files', () => {
    const wrapper = shallow(
      <File
        datasetId="ds001"
        path="sub-01:anat"
        filename="sub-01_T1w.nii.gz"
      />,
    )
    expect(wrapper.find('.download-file > a').prop('href')).toEqual(
      '/crn/datasets/ds001/files/sub-01:anat:sub-01_T1w.nii.gz',
    )
  })
})
