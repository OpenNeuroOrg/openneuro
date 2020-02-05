import React from 'react'
import gql from 'graphql-tag'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'


const searchQuery = gql`
  query searchConnection($q: String!) {
    search {
      searchConnection {
        q
      }
    }
  }
`

/**
 * This component is responsible for obtaining results from Elastic based
 * on the URL string and forwarding the data to the dashboard component
 */
const SearchResults = () => {
  const { query } = useParams()
  const { data, loading, error } = useQuery(searchQuery, {
    variables: {
      q: query,
    },
  })
  return <div>{query}</div>
}

export default SearchResults
