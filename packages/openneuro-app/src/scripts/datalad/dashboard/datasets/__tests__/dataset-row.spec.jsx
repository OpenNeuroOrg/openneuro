import React from 'react'
import { shallow } from 'enzyme'
import DatasetRow, { genLinkTarget } from '../dataset-row.jsx'

const dataset = {
  id: 'ds000001',
  draft: {
    description: {
      Name: 'test dataset',
    },
  },
  snapshots: [],
}

describe('dashboard/datasets/DatasetRow', () => {
  it('renders successfully', () => {
    expect(shallow(<DatasetRow dataset={dataset} />)).toMatchSnapshot()
  })
  describe('getLinkTarget', () => {
    it('creates a draft link for datasets with no snapshots', () => {
      const mockDataset = {
        id: 'ds000001',
        snapshots: [],
      }
      expect(genLinkTarget(mockDataset, true)).toBe('/datasets/ds000001')
    })
    it('creates a snapshot link for datasets with snapshots', () => {
      const mockDataset = {
        id: 'ds000001',
        snapshots: [
          {
            id: 'ds000001:1.0.0',
            created: new Date('2019-01-16T02:50:02.086Z'),
            tag: '1.0.0',
          },
          {
            id: 'ds000001:2.0.0',
            created: new Date('2019-01-16T02:51:09.420Z'),
            tag: '2.0.0',
          },
          {
            id: 'ds000001:1.0.1',
            created: new Date('2019-01-16T02:50:05.086Z'),
            tag: '1.0.1',
          },
        ],
      }
      expect(genLinkTarget(mockDataset, true)).toBe(
        '/datasets/ds000001/versions/2.0.0',
      )
    })
  })
})
