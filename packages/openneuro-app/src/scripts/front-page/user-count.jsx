import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const USER_COUNT = gql`
  query userCount {
    userCount
  }
`

export const userCountDisplay = ({ loading, data }) => {
  try {
    return loading ? null : data.userCount
  } catch (e) {
    return null
  }
}

const DatasetCount = () => (
  <Query query={USER_COUNT} errorPolicy="ignore">
    {userCountDisplay}
  </Query>
)

export default DatasetCount
