import { downloadUri } from '../download-uri.js'

const defProps = {
  datasetId: 'ds000001',
  snapshotTag: '1.0.0',
}

describe('downloadUri', () => {
  it('returns a draft path if snapshotTag is not defined', () => {
    expect(downloadUri(defProps.datasetId)).toBe(
      'localhost:9876/crn/datasets/ds000001/download',
    )
  })
  it('returns a snapshot path if snapshotTag is defined', () => {
    expect(downloadUri(defProps.datasetId, defProps.snapshotTag)).toBe(
      'localhost:9876/crn/datasets/ds000001/snapshots/1.0.0/download',
    )
  })
})
