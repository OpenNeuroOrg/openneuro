import React from 'react'
import { shallow } from 'enzyme'
import ShareDataset, { mergeNewPermission } from '../share.jsx'

describe('ShareDataset mutation', () => {
  it('renders with default props', () => {
    const wrapper = shallow(<ShareDataset />)
    expect(wrapper).toMatchSnapshot()
  })
  it('renders with typical props', () => {
    const wrapper = shallow(
      <ShareDataset
        datasetId="ds000005"
        userEmail="test@example.com"
        access="ro"
        done={jest.fn()}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })
  describe('mergeNewPermission()', () => {
    it('merges in a new permission object', () => {
      const oldPermissions = [
        {
          __typename: 'Permission',
          user: { __typename: 'User', id: '1234', email: 'test@example.com' },
          level: 'admin',
        },
      ]
      expect(
        mergeNewPermission(
          'ds000005',
          oldPermissions,
          { id: '5678', email: 'tester@example.com', name: 'Tester' },
          'ro',
        ),
      ).toEqual({
        __typename: 'Dataset',
        id: 'ds000005',
        permissions: [
          {
            __typename: 'Permission',
            level: 'admin',
            user: { __typename: 'User', email: 'test@example.com', id: '1234' },
          },
          {
            __typename: 'Permission',
            level: 'ro',
            user: {
              __typename: 'User',
              email: 'tester@example.com',
              id: '5678',
              name: 'Tester',
            },
          },
        ],
      })
    })
  })
})
