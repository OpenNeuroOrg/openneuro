import React from 'react'
import { shallow } from 'enzyme'
import SubscribeToNewsletter from '../subscribe-to-newsletter.jsx'

describe('SubscribeToNewsletter mutation', () => {
  it('renders with common props', () => {
    const wrapper = shallow(<SubscribeToNewsletter />)
    expect(wrapper).toMatchSnapshot()
  })
})
