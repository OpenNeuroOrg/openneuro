// @ts-nocheck
// TODO: remove @ts-nocheck

// Builds query components using the Elasticsearch Query DSL
// https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html

export function BoolQuery() {
  this.query = {
    bool: {},
  }
}
BoolQuery.prototype.addClause = function (type: string, query: object) {
  if (this.query.bool[type]) {
    this.query.bool[type] = {
      ...this.query.bool[type],
      ...query,
    }
  } else {
    this.query.bool[type] = query
  }
}
BoolQuery.prototype.get = function () {
  return this.query
}
BoolQuery.prototype.toString = function () {
  return JSON.stringify(this.query)
}

export const simpleQueryString = (queryString: string, fields?: string[]) => ({
  simple_query_string: {
    query: queryString,
    fields,
  },
})

export const matchQuery = (field, queryString, fuzziness, operator) => ({
  match: {
    [field]: {
      query: queryString,
      fuzziness,
      operator,
    },
  },
})

export const rangeQuery = (field, gte, lte, relation = 'INTERSECTS') => ({
  match: {
    [field]: {
      gte,
      lte,
      relation,
    },
  },
})

/** SimpleQueryString join multiple terms with and `+`. */
export const sqsJoinWithAND = (list: string[]) =>
  list.map(str => `"${str}"`).join(' + ')

export const useSearchResults = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const {
    keywords,
    datasetType_selected,
    datasetStatus_selected,
    modality_selected,
    ageRange,
    subjectCountRange,
    diagnosis_selected,
    tasks,
    authors,
    gender_selected,
    date_selected,
    species_selected,
    section_selected,
    studyDomain_selected,
    sortBy_selected,
  } = searchParams

  const boolQuery = new BoolQuery()
  if (keywords.length)
    boolQuery.addClause('must', simpleQueryString(sqsJoinWithAND(keywords)))
  if (datasetType_selected) {
  } // TODO: gql resolver level
  if (datasetStatus_selected) {
  } // TODO: gql resolver level
  if (modality_selected)
    qStrings.push(`metadata.modalities: ${modality_selected}`)
  if (isActiveRange(ageRange))
    qStrings.push(`metadata.ages: ${range(ageRange)}`)
  if (isActiveRange(subjectCountRange)) {
  } // TODO: https://discuss.elastic.co/t/painless-check-length-field-in-each-object-of-array/161699
  if (diagnosis_selected)
    qStrings.push(`metadata.dsStatus: ${diagnosis_selected}`)
  if (tasks.length)
    qStrings.push(`latestSnapshot.summary.tasks: ${joinWithAND(tasks)}`)
  if (authors.length)
    qStrings.push(`metadata.seniorAuthor: ${joinWithAND(authors)}`)
  if (gender_selected !== 'All') {
    qStrings.push(
      `latestSnapshot.summary.subjectMetadata.sex: ${gender_selected}`,
    )
  }
  const now = new Date()
  const last30 = new Date()
  const last180 = new Date()
  const last365 = new Date()
  last30.setDate(last30.getDate() - 30)
  last180.setDate(last180.getDate() - 180)
  last365.setDate(last365.getDate() - 365)

  if (date_selected === 'All Time') {
    qStrings.push(`created:${range([null, now])}`)
  } else if (date_selected === 'Last 30 days') {
    qStrings.push(`created:${range([last30, now])}`)
  } else if (date_selected === 'Last 180 days') {
    qStrings.push(`created:${range([last180, now])}`)
  } else if (date_selected === 'Last 12 months') {
    qStrings.push(`created:${range([last365, now])}`)
  }
  if (species_selected) qStrings.push(`metadata.species: ${species_selected}`)
  if (section_selected)
    qStrings.push(`metadata.studyLongitudinal: ${section_selected}`)
  if (studyDomain_selected)
    qStrings.push(`metadata.studyDomain: ${species_selected}`)

  const qString = joinWithAND(qStrings)

  return useQuery(searchQuery, {
    variables: {
      q: qString,
    },
    errorPolicy: 'ignore',
    // fetchPolicy is workaround for stuck loading bug (https://github.com/apollographql/react-apollo/issues/3270#issuecomment-579614837)
    // TODO: find better solution
    fetchPolicy: 'no-cache',
  })
}
