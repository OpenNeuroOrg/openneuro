import React from 'react'
import { mount } from 'enzyme'
import FileView from '../file-view.jsx'

describe('Publish dataset route', () => {
  it('renders with common props', () => {
    const wrapper = mount(<FileView datasetId="ds00001" />)
    expect(wrapper).toMatchSnapshot()
  })
})
