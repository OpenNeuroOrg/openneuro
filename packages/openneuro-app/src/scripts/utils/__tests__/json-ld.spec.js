import schemaGenerator from '../json-ld.js'

const mockDate = new Date('2020-08-11T20:53:56.110Z')
const mockSnapshot = {
  id: 'ds000000:1.0.0',
  created: mockDate,
  description: {
    Name: 'Fake dataset',
    Authors: ['Jane Doe', 'John Doe'],
  },
  readme: 'This is a test dataset',
  tag: '1.0.0',
}

describe('schemaGenerator()', () => {
  it('returns a valid license field', () => {
    const jsonld = JSON.parse(schemaGenerator(mockSnapshot))
    expect(jsonld.license).toMatch(/https:\/\//)
  })
  it('returns organization for publisher type', () => {
    const jsonld = JSON.parse(schemaGenerator(mockSnapshot))
    expect(jsonld.publisher['@type']).toEqual('Organization')
    expect(jsonld.publisher.name).toEqual('OpenNeuro')
  })
})
