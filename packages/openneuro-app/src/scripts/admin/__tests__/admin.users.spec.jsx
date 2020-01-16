import React from 'react'
import { shallow } from 'enzyme'
import { UsersQueryResult } from '../admin.users.jsx'

describe('Admin users tab', () => {
  describe('UsersQueryResult component', () => {
    it('should not crash in a loading state', () => {
      expect(() => {
        shallow(
          <UsersQueryResult loading={true} data={null} refetch={jest.fn()} />,
        )
      }).not.toThrowError()
    })
  })
})
