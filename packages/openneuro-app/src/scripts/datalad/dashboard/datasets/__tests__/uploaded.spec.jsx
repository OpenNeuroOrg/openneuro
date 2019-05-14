import React from 'react'
import { shallow } from 'enzyme'
import Uploaded from '../uploaded.jsx'

const defProps = {
  uploader: {
    name: 'A User',
  },
  created: null, // Avoid testing the current date
}

describe('dashboard/datasets/Uploaded', () => {
  it('renders successfully', () => {
    const wrapper = shallow(<Uploaded {...defProps} />)
    expect(wrapper).toMatchSnapshot()
  })
})
