import React from 'react'
import { shallow } from 'enzyme'
import { HasBeenPublished } from '../dataset-content.jsx'

describe('DatasetContent component', () => {
  describe('HasBeenPublished', () => {
    it('public datasets show success banner', () => {
      const wrapper = shallow(<HasBeenPublished datasetId="1" isPublic />)
      expect(wrapper.at(0).hasClass('alert-success')).toBeTruthy()
    })
    it('non-public datasets show warning banner', () => {
      const wrapper = shallow(<HasBeenPublished datasetId="1" />)
      expect(wrapper.at(0).hasClass('alert-warning')).toBeTruthy()
    })
  })
})
