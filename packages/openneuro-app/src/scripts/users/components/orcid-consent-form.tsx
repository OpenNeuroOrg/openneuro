import React, { useEffect, useState } from "react"
import * as Sentry from "@sentry/react"
import { useMutation } from "@apollo/client"

import { Button } from "../../components/button/Button"
import { GET_USER, UPDATE_USER } from "../../queries/user"
import { RadioGroup } from "../../components/radio/RadioGroup"

export interface OrcidConsentFormProps {
  userId: string
  initialOrcidConsent: boolean | null
  onConsentUpdated?: (newConsent: boolean | null) => void
}

export const OrcidConsentForm: React.FC<OrcidConsentFormProps> = ({
  userId,
  initialOrcidConsent,
  onConsentUpdated,
}) => {
  const [consentValue, setConsentValue] = useState<string>(
    initialOrcidConsent === true
      ? "true"
      : (initialOrcidConsent === false ? "false" : ""),
  )

  // Store the initial consent value as a string for comparison
  const initialConsentString = initialOrcidConsent === true
    ? "true"
    : (initialOrcidConsent === false ? "false" : "")

  useEffect(() => {
    setConsentValue(initialConsentString)
  }, [initialConsentString])

  const [updateUser, { loading: updatingConsent }] = useMutation(
    UPDATE_USER,
    {
      refetchQueries: userId
        ? [{ query: GET_USER, variables: { userId: userId } }]
        : [],
      onCompleted: (data) => {
        if (onConsentUpdated) {
          onConsentUpdated(data.updateUser.orcidConsent)
        }
      },
      onError: (error) => {
        Sentry.captureException(error)
      },
    },
  )

  const handleSaveConsent = async () => {
    let finalConsentValue: boolean | null = null
    if (consentValue === "true") {
      finalConsentValue = true
    } else if (consentValue === "false") {
      finalConsentValue = false
    }

    if (userId && finalConsentValue !== null) {
      try {
        await updateUser({
          variables: { id: userId, orcidConsent: finalConsentValue },
        })
      } catch (error) {
        Sentry.captureException(error)
      }
    }
  }

  const radioOptions = [
    { label: "I consent", value: "true" },
    { label: "I DO NOT consent", value: "false" },
  ]

  const handleRadioChange = (value: string) => {
    setConsentValue(value)
  }

  // The button is visible only if the current selection is different from the initial value
  const showSaveButton = consentValue !== initialConsentString
  const isSaveDisabled = updatingConsent

  return (
    <div>
      <p>
        {onConsentUpdated && "You’ve connected your ORCID iD — thank you!"}
      </p>
      <p>
        With your permission, OpenNeuro can publish information about your
        public datasets to your ORCID record. This allows your research
        contributions to be automatically included in your ORCID profile and
        ensures they are accurately attributed to you.{" "}
        <a
          href="https://orcid.org/content/about-orcid"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more about how your ORCID record works.
        </a>
      </p>
      <p>
        By consenting, you agree that:
      </p>
      <ul>
        <li>
          A record will be added to your ORCID profile when you publish a
          dataset on OpenNeuro.
        </li>
        <li>
          If the dataset is updated (e.g., versioning, metadata), the ORCID
          record will be updated accordingly.
        </li>
        <li>
          You can revoke this permission at any time in your account settings.
        </li>
      </ul>

      <div>
        <RadioGroup
          name={onConsentUpdated ? "orcidConsent-modal" : "orcidConsent"}
          layout="row"
          radioArr={radioOptions}
          selected={consentValue}
          setSelected={handleRadioChange}
          additionalText="to OpenNeuro publishing and updating my dataset records to my ORCID profile."
        />
      </div>

      {showSaveButton && (
        <Button
          size="small"
          primary
          onClick={handleSaveConsent}
          label={updatingConsent ? "Saving..." : "Save Consent"}
          disabled={isSaveDisabled}
        />
      )}
    </div>
  )
}
