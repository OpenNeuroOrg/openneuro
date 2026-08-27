import React, { useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { useLocation } from "react-router-dom"
import { gql, useMutation } from "@apollo/client"
import { getProfile } from "../../authentication/profile"
import { useUser } from "../../queries/user"
import { Button } from "../../components/button/Button"
import { Input } from "../../components/input/Input"
import { Textarea } from "../../components/textarea/Textarea"
import "./zammad-widget.scss"

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

export interface ZammadWidgetProps {
  subject?: string
  error?: Error
  sentryId?: string
  description?: string
}

const SUBMIT_THANKS =
  "Thank you for taking the time to report your case. A support representative will be reviewing your request and will send you a personal response within 24 to 48 hours."

const SupportEmailFallback = ({ message }: { message: string }) => (
  <p className="zammad-widget-message">
    {message} Please email{" "}
    <a href={`mailto:${SUPPORT_EMAIL}`}>
      {SUPPORT_EMAIL}
    </a>{" "}
    instead.
  </p>
)

function ZammadWidget(
  { subject, error, sentryId, description }: ZammadWidgetProps,
) {
  const [cookies] = useCookies()
  const { pathname } = useLocation()
  const { user } = useUser()
  // getProfile returns a fresh object each render, so keep the effect dependency
  // a stable boolean rather than the profile itself
  const signedIn = Boolean(getProfile(cookies))

  const [title, setTitle] = useState(subject || "")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [body, setBody] = useState(description || "")
  const [hasError, setHasError] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [createSupportTicket, { loading }] = useMutation(CREATE_SUPPORT_TICKET)

  // Prefill contact details once the signed in user's profile resolves
  useEffect(() => {
    if (signedIn && user?.email) {
      setEmail((current) => current || user.email)
      setName((current) => current || user.name || "")
    }
  }, [signedIn, user?.email, user?.name])

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (loading) return
    setHasError(false)

    try {
      const response = await createSupportTicket({
        variables: {
          name,
          email,
          title,
          body,
          error: error ? String(error) : undefined,
          sentryId,
          referrer: pathname,
        },
      })
      if (response.data?.createSupportTicket) {
        setSubmitted(true)
      } else {
        setHasError(true)
      }
    } catch {
      setHasError(true)
    }
  }

  if (hasError) {
    return (
      <SupportEmailFallback message="The support form is unavailable right now." />
    )
  }

  if (submitted) {
    return <p className="zammad-widget-message">{SUBMIT_THANKS}</p>
  }

  return (
    <form
      className="zammad-widget"
      aria-label="Feedback Form"
      onSubmit={onSubmit}
    >
      <Input
        name="name"
        type="text"
        label="Name"
        placeholder="Your name"
        value={name}
        setValue={setName}
      />
      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        value={email}
        setValue={setEmail}
      />
      <Input
        name="title"
        type="text"
        label="Subject"
        placeholder="Summary of your request"
        value={title}
        setValue={setTitle}
      />
      <Textarea
        name="body"
        label="Description"
        placeholder="What were you trying to do when the problem occurred?"
        value={body}
        setValue={(event) => setBody(event.currentTarget.value)}
      />
      <Button
        primary
        type="submit"
        size="small"
        disabled={loading}
        label={loading ? "Sending..." : "Request Support"}
      />
    </form>
  )
}

export default ZammadWidget
