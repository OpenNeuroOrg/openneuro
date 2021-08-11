// Builds query components using the Elasticsearch Query DSL
// https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html

const emptyQuery = () => ({
  bool: {},
})
export function BoolQuery() {
  this.query = emptyQuery()
}
BoolQuery.prototype.addClause = function (type: string, query: object) {
  if (this.query.bool[type]) {
    this.query.bool[type] = [...this.query.bool[type], query]
  } else {
    this.query.bool[type] = [query]
  }
}
BoolQuery.prototype.get = function () {
  return this.query
}
BoolQuery.prototype.toString = function () {
  return JSON.stringify(this.query)
}
BoolQuery.prototype.isEmpty = function () {
  return JSON.stringify(this.query) === JSON.stringify(emptyQuery())
}

export const simpleQueryString = (
  queryString: string,
  fields?: string[],
  fuzzy = true,
) => ({
  simple_query_string: {
    query: `${queryString}${fuzzy ? '~' : ''}`,
    fields,
  },
})

export const matchQuery = (
  field: string,
  queryString: string,
  fuzziness?: string,
  operator?: string,
) => ({
  match: {
    [field]: {
      query: queryString,
      fuzziness,
      operator,
    },
  },
})

export const rangeQuery = (
  field,
  gte?: number | string,
  lte?: number | string,
  relation: string = 'INTERSECTS',
) => ({
  range: {
    [field]: {
      gte,
      lte,
      relation,
    },
  },
})

export const rangeListLengthQuery = (field, gte: number, lte: number) => {
  return {
    script: {
      script: {
        lang: 'painless',
        source: `
          if (doc.containsKey(params.field)) {
            return ( doc[params.field].value.length() >= params.gte && doc[params.field].value.length() <= params.lte )
          } else return false`,
        params: {
          field,
          gte,
          lte,
        },
      },
    },
  }
}

/** SimpleQueryString join multiple terms with and `+`. */
export const sqsJoinWithAND = (list: string[]) =>
  list.map(str => `${str}`).join(' + ')
export const joinWithOR = (list: string[]) =>
  list.map(str => `${str}`).join(' | ')
