import { gql } from "@apollo/client"

/** Support inbox shown when the embedded form is unavailable */
export const SUPPORT_EMAIL = "openneuro@zammad.com"

export const CREATE_SUPPORT_TICKET = gql`
  mutation createSupportTicket(
    $name: String
    $email: String!
    $title: String!
    $body: String!
    $error: String
    $sentryId: String
    $referrer: String
  ) {
    createSupportTicket(
      name: $name
      email: $email
      title: $title
      body: $body
      error: $error
      sentryId: $sentryId
      referrer: $referrer
    )
  }
`
