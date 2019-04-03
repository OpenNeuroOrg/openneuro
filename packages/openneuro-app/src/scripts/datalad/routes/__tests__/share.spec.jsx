import React from 'react'
import { shallow } from 'enzyme'
import { PermissionRow } from '../share.jsx'

describe('Share dataset route', () => {
  describe('PermissionRow', () => {
    it('renders for admin permissions', () => {
      expect(
        shallow(
          <PermissionRow
            datasetId="ds00001"
            userId="1234"
            userEmail="tester@example.com"
            access="admin"
          />,
        ),
      ).toMatchSnapshot()
    })
    it('renders for ro permissions', () => {
      expect(
        shallow(
          <PermissionRow
            datasetId="ds00001"
            userId="1234"
            userEmail="tester@example.com"
            access="ro"
          />,
        ),
      ).toMatchSnapshot()
    })
    it('renders for rw permissions', () => {
      expect(
        shallow(
          <PermissionRow
            datasetId="ds00001"
            userId="1234"
            userEmail="tester@example.com"
            access="rw"
          />,
        ),
      ).toMatchSnapshot()
    })
  })
})
