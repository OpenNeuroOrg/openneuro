import { getKibanaURL } from '../kibana'

describe('getKibanaURL', () => {
  const ENV = process.env
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...ENV }
  })
  afterAll(() => {
    process.env = ENV
  })

  it('returns a valid url when env var ELASTICSEARCH_CLOUD_ID exists', () => {
    process.env.ELASTICSEARCH_CLOUD_ID =
      'openneuro-staging:dXMtZWFzdC0xLmF3cy5mb3VuZC5pbyRjYjQ2MWUyYzA5ZDU0MDVlODRmM2I0NDJiMDA0NmIzOSRhMjEzNmNkMGU2YjA0NTllOTVhMWU2MDRiNTViOTY0OA=='
    const url = getKibanaURL()
    expect(url).toEqual(
      'https://a2136cd0e6b0459e95a1e604b55b9648.us-east-1.aws.found.io:9243/app/discover#/',
    )
  })

  it('returns a localhost url when ELASTICSEARCH_CLOUD_ID does not exist', () => {
    process.env.ELASTICSEARCH_CLOUD_ID = undefined
    const url = getKibanaURL()
    expect(url).toEqual('http://localhost:5601/app/discover#/')
  })
})
