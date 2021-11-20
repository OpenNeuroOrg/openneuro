import React from 'react'
import { shallow } from 'enzyme'
import UpdateDescription, {
  mergeFieldValue,
  UPDATE_DESCRIPTION,
  UPDATE_DESCRIPTION_LIST,
} from '../description.jsx'

describe('UpdateDescription mutation', () => {
  it('renders with common props', () => {
    const wrapper = shallow(
      <UpdateDescription
        datasetId="ds001"
        field="Name"
        value="New Name"
        done={jest.fn()}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('uses the scalar mutation for scalar values', () => {
    const wrapper = shallow(
      <UpdateDescription
        datasetId="ds001"
        field="Name"
        value="New Name"
        done={jest.fn()}
      />,
    )
    expect(wrapper.find('Mutation').props().mutation).toEqual(
      UPDATE_DESCRIPTION,
    )
  })
  it('uses the list mutation for array values', () => {
    const wrapper = shallow(
      <UpdateDescription
        datasetId="ds001"
        field="Authors"
        value={['John Doe', 'Jane Doe']}
        done={jest.fn()}
      />,
    )
    expect(wrapper.find('Mutation').props().mutation).toEqual(
      UPDATE_DESCRIPTION_LIST,
    )
  })
  describe('mergeFieldValue()', () => {
    it('merges in scalar fields', () => {
      expect(
        mergeFieldValue(
          'ds001',
          {
            __typename: 'Draft',
            id: '1234',
            created: '1999',
            description: {
              Name: 'Old Name',
              BIDSVersion: '1.2',
              License: 'AGPL3',
            },
          },
          { Name: 'New Name', BIDSVersion: '1.2', License: 'AGPL3' },
          null,
        ),
      ).toEqual({
        __typename: 'Dataset',
        draft: {
          __typename: 'Draft',
          created: '1999',
          description: {
            BIDSVersion: '1.2',
            License: 'AGPL3',
            Name: 'New Name',
          },
          id: '1234',
        },
        id: 'ds001',
      })
    })
    it('merges in array fields', () => {
      expect(
        mergeFieldValue(
          'ds001',
          {
            __typename: 'Draft',
            id: '1234',
            created: '1999',
            description: {
              Name: 'Old Name',
              BIDSVersion: '1.2',
              License: 'AGPL3',
              Authors: [],
            },
          },
          null,
          {
            Name: 'New Name',
            BIDSVersion: '1.2',
            License: 'AGPL3',
            Authors: ['One', 'Two'],
          },
        ),
      ).toEqual({
        __typename: 'Dataset',
        draft: {
          __typename: 'Draft',
          created: '1999',
          description: {
            Authors: ['One', 'Two'],
            BIDSVersion: '1.2',
            License: 'AGPL3',
            Name: 'New Name',
          },
          id: '1234',
        },
        id: 'ds001',
      })
    })
  })
})
