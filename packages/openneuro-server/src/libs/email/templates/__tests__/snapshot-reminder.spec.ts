import { snapshotReminder } from '../snapshot-reminder'

describe('email template -> comment created', () => {
  it('renders with expected arguments', () => {
    expect(
        snapshotReminder({
        siteUrl: 'https://openneuro.org',
        name: 'J. Doe',
        datasetName: 'Reminding Dataset',
        datasetId: 'ds12345678'
      }),
    ).toMatchSnapshot()
  })
})
