import React from 'react'
import { shallow } from 'enzyme'
import { HasBeenPublished } from '../dataset-content.jsx'
import { hasEditPermissions } from '../../../authentication/profile.js'

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
  describe('hasEditPermissions()', () => {
    it('returns false for anonymous users', () => {
      expect(hasEditPermissions([{}])).toBe(false)
    })
    it('returns true for admin users', () => {
      expect(
        hasEditPermissions([{ user: { id: '1234' }, level: 'admin' }], '1234'),
      ).toBe(true)
    })
    it('returns true for rw users', () => {
      expect(
        hasEditPermissions([{ user: { id: '1234' }, level: 'rw' }], '1234'),
      ).toBe(true)
    })
    it('returns false for ro users', () => {
      expect(
        hasEditPermissions([{ user: { id: '1234' }, level: 'ro' }], '1234'),
      ).toBe(false)
    })
  })
})
