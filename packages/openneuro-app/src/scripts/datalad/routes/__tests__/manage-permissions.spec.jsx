import React from 'react'
import { shallow } from 'enzyme'
import { PermissionRow, ShareTable } from '../manage-permissions.jsx'

describe('Manage dataset permissions route', () => {
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
  describe('ShareTable', () => {
    const id = 'ds001'
    it('renders with no permissions', () => {
      expect(
        shallow(
          <ShareTable
            datasetId={id}
            permissions={{ id, userPermissions: [] }}
          />,
        ),
      ).toMatchSnapshot()
    })
    it('renders with one permission', () => {
      expect(
        shallow(
          <ShareTable
            datasetId={id}
            permissions={{
              id,
              userPermissions: [
                {
                  user: { id: '1234', email: 'test@example.com' },
                  access: 'ro',
                },
              ],
            }}
          />,
        ),
      ).toMatchSnapshot()
    })
    it('renders with many permissions', () => {
      expect(
        shallow(
          <ShareTable
            datasetId={id}
            permissions={{
              id,
              userPermissions: [
                {
                  user: { id: '1234', email: 'test@example.com' },
                  access: 'ro',
                },
                {
                  user: { id: '5678', email: 'tester@example.com' },
                  access: 'rw',
                },
                {
                  user: { id: '91011', email: 'testr@example.com' },
                  access: 'admin',
                },
              ],
            }}
          />,
        ),
      ).toMatchSnapshot()
    })
  })
})
