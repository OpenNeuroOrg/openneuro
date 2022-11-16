import { ownerUnsubscribed } from '../owner-unsubscribed'

describe('email template -> comment created', () => {
  it('renders with expected arguments', () => {
    expect(
      ownerUnsubscribed({
        siteUrl: 'https://openneuro.org',
        name: 'J. Doe',
        datasetName: 'ds1245678',
      }),
    ).toMatchSnapshot()
  })
})
