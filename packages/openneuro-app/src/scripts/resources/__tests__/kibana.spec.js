import { getKibanaURL } from '../kibana'

describe('getKibanaURL', () => {
  it('returns a valid url when env var ELASTICSEARCH_CLOUD_ID exists', () => {
    const config = {
      elasticsearch: {
        cloudID:
          'openneuro-staging:dXMtZWFzdC0xLmF3cy5mb3VuZC5pbyRjYjQ2MWUyYzA5ZDU0MDVlODRmM2I0NDJiMDA0NmIzOSRhMjEzNmNkMGU2YjA0NTllOTVhMWU2MDRiNTViOTY0OA==',
      },
    }
    const url = getKibanaURL(config)
    expect(url).toEqual(
      'https://a2136cd0e6b0459e95a1e604b55b9648.us-east-1.aws.found.io:9243/app/discover#/',
    )
  })

  it('returns a localhost url when ELASTICSEARCH_CLOUD_ID does not exist', () => {
    const config = {}
    const url = getKibanaURL(config)
    expect(url).toEqual('http://localhost:5601/app/discover#/')
  })
})
