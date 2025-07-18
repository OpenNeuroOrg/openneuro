import React, { useEffect, useState } from "react"
import * as Sentry from "@sentry/react"
import { Modal } from "../components/modal/Modal"
import { useUser } from "../queries/user"
import { OrcidConsentForm } from "./components/orcid-consent-form"

export const OrcidConsentModal: React.FC<Record<string, never>> = () => {
  // State to control the visibility of the modal
  const [isOpen, setIsOpen] = useState(false)

  // Fetch the current user's ORCID consent status using the existing useUser hook
  const { user, loading, error } = useUser(undefined)
  const userOrcidConsent = user?.orcidConsent
  const userId = user?.id

  // Define the toggle function for the modal
  // Now, the modal can always be closed by the 'X' button
  const toggle = () => {
    setIsOpen(!isOpen)
  }

  // Effect to open the modal if orcidConsent is null
  useEffect(() => {
    // Modal should open if not loading, no error, user exists, and orcidConsent is null
    if (!loading && !error && user && userOrcidConsent === null) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [loading, error, user, userOrcidConsent])

  if (loading) return null
  if (error) {
    Sentry.captureException(error)
    return null
  }

  // Only render the modal if orcidConsent is null
  if (userOrcidConsent !== null) {
    return null
  }

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} className="modal-lg">
        {userId && (
          <OrcidConsentForm
            userId={userId}
            initialOrcidConsent={userOrcidConsent}
            onConsentUpdated={() => setIsOpen(false)} // Close modal after consent is updated
          />
        )}
      </Modal>
    </>
  )
}
