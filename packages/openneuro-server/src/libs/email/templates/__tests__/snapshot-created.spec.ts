import { snapshotCreated } from '../snapshot-created'

describe('email template -> comment created', () => {
  it('renders with expected arguments', () => {
    expect(
        snapshotCreated({
        siteUrl: 'https://openneuro.org',
        name: 'J. Doe',
        datasetId: 'ds1245678',
        datasetLabel: 'Test Dataset Snapshot Created',
        versionNumber: '1.2.4',
        changelog: 'New changes...'
      }),
    ).toMatchSnapshot()
  })
})
