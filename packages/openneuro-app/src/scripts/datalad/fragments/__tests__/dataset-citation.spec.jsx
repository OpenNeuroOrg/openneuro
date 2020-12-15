import { formatCitation } from '../dataset-citation.jsx'

const snapshot = {
  id: 'ds999999:1.0.2',
  created: new Date('2020-12-15T18:32:51.679Z'),
  description: {
    Authors: ['Jane Doe', 'Doe, John'],
    Name: 'A Test Dataset',
    DatasetDOI: 'doinumbersgohere',
  },
}

describe('formatCitation', () => {
  it('should work with "Text" input', () => {
    expect(formatCitation(snapshot, 'Text')).toEqual(
      'Jane Doe and Doe, John (NaN). A Test Dataset. OpenNeuro. [Dataset] doi: doinumbersgohere',
    )
  })
  it('should work with "BibTeX" input', () => {
    expect(formatCitation(snapshot, 'BibTeX')).toEqual(`@dataset{ds999999:1.0.2,
  author = {Jane Doe and Doe, John},
  title = {"A Test Dataset"},
  year = {NaN},
  doi = {doinumbersgohere},
  publisher = {OpenNeuro}
}`)
  })
})
