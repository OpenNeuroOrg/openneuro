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
  relation?: string = 'INTERSECTS',
) => ({
  match: {
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
        source: `if (doc.containsKey(params.field)) { doc[params.field].values.length >= params.gte && doc[params.field].values.length <= params.lte } else return false`,
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
  list.map(str => `"${str}"`).join(' + ')
