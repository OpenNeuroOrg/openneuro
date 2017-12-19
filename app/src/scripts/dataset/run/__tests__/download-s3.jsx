import React from 'react'
import { shallow } from 'enzyme'
import DownloadS3 from '../download-s3.jsx'
import { Modal } from 'react-bootstrap'

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
  it('displays a help message if the s3:// URL is clicked', () => {
    const wrapper = shallow(
      <DownloadS3 datasetHash={datasetHash} analysisId={analysisId} />,
    )
    const s3Link = wrapper.find('a.s3-link')
    const preventDefault = jest.fn()
    s3Link.simulate('click', { preventDefault })
    expect(wrapper.find('Modal').props()['show']).toBe(true)
  })
  it('closes the modal when the close button is clicked', () => {
    const wrapper = shallow(
      <DownloadS3 datasetHash={datasetHash} analysisId={analysisId} />,
    )
    const s3Link = wrapper.find('a.s3-link')
    const preventDefault = jest.fn()
    s3Link.simulate('click', { preventDefault })
    // After opening the modal, hide it and see if that works correctly
    const modal = wrapper.find('Modal')
    modal.simulate('hide')
    expect(wrapper.find('Modal').props()['show']).toBe(false)
  })
})
