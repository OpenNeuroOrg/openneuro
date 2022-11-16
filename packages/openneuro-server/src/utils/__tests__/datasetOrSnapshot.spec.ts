import { describe, it, expect } from 'vitest'
import {
  datasetOrSnapshot,
  getDatasetFromSnapshotId,
} from '../datasetOrSnapshot'

describe('datasetOrSnapshot()', () => {
  it('resolves a dataset object correctly', () => {
    const dataset = {
      id: 'ds000001',
      revision: 'abcfdeg',
      modified: new Date(),
      draft: {
        id: 'abcfdeg',
      },
    }
    expect(datasetOrSnapshot(dataset)).toEqual({
      datasetId: 'ds000001',
      revision: 'abcfdeg',
    })
  })
  it('resolves snapshot objects correctly', () => {
    const snapshot = {
      id: 'ds000001:1.0.0',
      tag: '1.0.0',
      hexsha: 'abcfdeg',
      modified: new Date(),
      files: [{ id: '1234', filename: 'dataset_description.json' }],
    }
    expect(datasetOrSnapshot(snapshot)).toEqual({
      datasetId: 'ds000001',
      revision: 'abcfdeg',
    })
  })
  it('resolves the snapshot tag only corner case', () => {
    const snapshot = {
      id: 'ds000002:1.0.1',
      tag: '1.0.1',
      modified: new Date(),
    }
    expect(datasetOrSnapshot(snapshot)).toEqual({
      datasetId: 'ds000002',
      revision: '1.0.1',
    })
  })
  describe('getDatasetFromSnapshotId', () => {
    it('extracts the datasetId correctly', () => {
      expect(getDatasetFromSnapshotId('ds000001:1.0.0')).toBe('ds000001')
    })
  })
})
