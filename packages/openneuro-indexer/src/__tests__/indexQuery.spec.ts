import { indexQuery } from '../indexQuery'

describe('indexQuery', () => {
  it('exports a graphql-tag query', () => {
    expect(indexQuery.definitions[0].operation).toBe('query')
  })
})
