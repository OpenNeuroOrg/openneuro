import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import EmailSubscriptionBox from '../../front-page/email-subscription-box.jsx'
import { datasetQueryRefetch } from '../dataset/dataset-query-refetch.js'

const SUBSCRIBE_TO_NEWSLETTER = gql`
  mutation subscribeToNewsletter($email: String!) {
    subscribeToNewsletter(email: $email)
  }
`

const SubscribeToNewsletter = () => (
  <Mutation mutation={SUBSCRIBE_TO_NEWSLETTER}>
    {subscribeToNewsletter => (
      <EmailSubscriptionBox
        subscribe={(email, cb) => {
          subscribeToNewsletter({ variables: { email } })
            .then(cb)
            .catch(cb)
        }}
      />
    )}
  </Mutation>
)

SubscribeToNewsletter.propTypes = {}

export default SubscribeToNewsletter
