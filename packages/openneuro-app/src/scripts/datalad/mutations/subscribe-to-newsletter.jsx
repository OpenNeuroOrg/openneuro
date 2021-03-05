import React from 'react'
import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'
import EmailSubscriptionBox from '../../front-page/email-subscription-box.jsx'

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
          subscribeToNewsletter({ variables: { email } }).then(cb).catch(cb)
        }}
      />
    )}
  </Mutation>
)

SubscribeToNewsletter.propTypes = {}

export default SubscribeToNewsletter
