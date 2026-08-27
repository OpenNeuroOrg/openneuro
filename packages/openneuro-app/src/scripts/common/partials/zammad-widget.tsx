import React, { useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { useLocation } from "react-router-dom"
import { getProfile } from "../../authentication/profile"
import { config } from "../../config"
import { useUser } from "../../queries/user"
import { Button } from "../../components/button/Button"
import { Input } from "../../components/input/Input"
import { Textarea } from "../../components/textarea/Textarea"
import type { ZammadFormConfig, ZammadFormErrors } from "./zammad"
import {
  fetchFormConfig,
  getFingerprint,
  submitForm,
  SUPPORT_EMAIL,
} from "./zammad"
import "./zammad-widget.scss"

export interface ZammadWidgetProps {
  subject?: string
  error?: Error
  sentryId?: string
  description?: string
}

interface BodyContext {
  description?: string
  error?: Error
  sentryId?: string
  referrer?: string
}

/**
 * Zammad's form channel has no custom fields, so the diagnostic context
 * Freshdesk carried in meta[] is appended to the ticket body instead
 */
export const buildBody = (
  { description, error, sentryId, referrer }: BodyContext,
): string =>
  [
    description,
    error && String(error),
    sentryId && `Sentry ID: ${sentryId}`,
    referrer && `Page: ${referrer}`,
  ]
    .filter((line) => line)
    .join("\n\n")

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

  // The token is bound to this fingerprint, so generate it once per mount
  const [fingerprint] = useState(getFingerprint)
  const [formConfig, setFormConfig] = useState<ZammadFormConfig | null>(null)
  const [unavailable, setUnavailable] = useState(false)
  const [title, setTitle] = useState(subject || "")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [body, setBody] = useState(
    buildBody({ description, error, sentryId, referrer: pathname }),
  )
  const [errors, setErrors] = useState<ZammadFormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Prefill contact details once the signed in user's profile resolves
  useEffect(() => {
    if (signedIn && user?.email) {
      setEmail((current) => current || user.email)
      setName((current) => current || user.name || "")
    }
  }, [signedIn, user?.email, user?.name])

  useEffect(() => {
    if (!config.support?.url) {
      setUnavailable(true)
      return
    }
    let active = true
    fetchFormConfig(config.support.url, fingerprint)
      .then((fetched) => {
        if (!active) return
        if (fetched.enabled) {
          setFormConfig(fetched)
        } else {
          setUnavailable(true)
        }
      })
      .catch(() => {
        if (active) setUnavailable(true)
      })
    return () => {
      active = false
    }
  }, [fingerprint])

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!formConfig || submitting) return
    setSubmitting(true)
    setErrors({})
    try {
      const fieldErrors = await submitForm(formConfig, fingerprint, {
        name,
        email,
        title,
        body,
      })
      if (fieldErrors) {
        setErrors(fieldErrors)
      } else {
        setSubmitted(true)
      }
    } catch {
      setUnavailable(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (unavailable) {
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
      {errors.name ? <span className="form-error">{errors.name}</span> : null}
      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        value={email}
        setValue={setEmail}
      />
      {errors.email ? <span className="form-error">{errors.email}</span> : null}
      <Input
        name="title"
        type="text"
        label="Subject"
        placeholder="Summary of your request"
        value={title}
        setValue={setTitle}
      />
      {errors.title ? <span className="form-error">{errors.title}</span> : null}
      <Textarea
        name="body"
        label="Description"
        placeholder="What were you trying to do when the problem occurred?"
        value={body}
        setValue={(event) => setBody(event.currentTarget.value)}
      />
      {errors.body ? <span className="form-error">{errors.body}</span> : null}
      <Button
        primary
        type="submit"
        size="small"
        disabled={!formConfig || submitting}
        label={submitting ? "Sending..." : "Request Support"}
      />
    </form>
  )
}

export default ZammadWidget
