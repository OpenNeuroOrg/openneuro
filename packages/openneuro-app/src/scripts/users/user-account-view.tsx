import React, { useState } from "react"
import Helmet from "react-helmet"
import * as Sentry from "@sentry/react"
import { useMutation } from "@apollo/client"
import { EditableContent } from "./components/editable-content"
import { GET_USER, UPDATE_USER } from "../queries/user"
import styles from "./scss/useraccountview.module.scss"
import { GitHubAuthButton } from "./github-auth-button"
import type { UserAccountViewProps } from "../types/user-types"
import { OrcidConsentForm } from "./components/orcid-consent-form"
import { validateHttpHttpsUrl } from "../utils/validationUtils"
import { pageTitle } from "../resources/strings.js"

export const UserAccountView: React.FC<UserAccountViewProps> = ({
  orcidUser,
}) => {
  const [userLinks, setLinks] = useState<string[]>(orcidUser?.links || [])
  const [userLocation, setLocation] = useState<string>(
    orcidUser?.location || "",
  )
  const [userInstitution, setInstitution] = useState<string>(
    orcidUser?.institution || "",
  )
  const [updateUser] = useMutation(UPDATE_USER)

  const handleLinksChange = async (newLinks: string[]) => {
    setLinks(newLinks)
    try {
      await updateUser({
        variables: {
          id: orcidUser?.orcid,
          links: newLinks,
        },
        refetchQueries: [
          {
            query: GET_USER,
            variables: { id: orcidUser?.orcid },
          },
        ],
      })
    } catch (error) {
      Sentry.captureException(error)
    }
  }

  const handleLocationChange = async (newLocation: string) => {
    setLocation(newLocation)

    try {
      await updateUser({
        variables: {
          id: orcidUser?.orcid,
          location: newLocation,
        },
        refetchQueries: [
          {
            query: GET_USER,
            variables: { id: orcidUser?.orcid },
          },
        ],
      })
    } catch (error) {
      Sentry.captureException(error)
    }
  }

  const handleInstitutionChange = async (newInstitution: string) => {
    setInstitution(newInstitution)

    try {
      await updateUser({
        variables: {
          id: orcidUser?.orcid,
          institution: newInstitution,
        },
        refetchQueries: [
          {
            query: GET_USER,
            variables: { id: orcidUser?.orcid },
          },
        ],
      })
    } catch (error) {
      Sentry.captureException(error)
    }
  }

  return (
    <>
      <Helmet>
        <title>
            {orcidUser.name || "User"} profile - {pageTitle}
        </title>
      </Helmet>
      <div data-testid="user-account-view" className={styles.useraccountview}>
        <h3>Account</h3>
        <ul className={styles.accountDetail}>
          <li>
            <span>Name:</span>
            {orcidUser.name}
          </li>
          <li>
            <span>Email:</span>
            {orcidUser.email}
          </li>
          <li>
            <span>ORCID:</span>
            {orcidUser.orcid}
          </li>
          {orcidUser?.github &&
            (
              <li>
                <span>GitHub:</span>
                {orcidUser.github}
              </li>
            )}
          <li>
            <GitHubAuthButton sync={orcidUser.githubSynced} />
          </li>
        </ul>

        <EditableContent
          editableContent={userLinks}
          setRows={handleLinksChange}
          heading="Links"
          validation={validateHttpHttpsUrl}
          validationMessage="Invalid URL format. Please start with http:// or https://"
          data-testid="links-section"
        />

        {orcidUser?.id && orcidUser?.orcid !== undefined && (
          <div className={styles.umbOrcidConsent}>
            <div className={styles.umbOrcidHeading}>
              <h4>ORCID Integration</h4>
            </div>
            <OrcidConsentForm
              userId={orcidUser.id}
              initialOrcidConsent={orcidUser.orcidConsent}
            />
          </div>
        )}

        <EditableContent
          editableContent={userLocation}
          setRows={handleLocationChange}
          heading="Location"
          data-testid="location-section"
        />
        <EditableContent
          editableContent={userInstitution}
          setRows={handleInstitutionChange}
          heading="Institution"
          data-testid="institution-section"
        />
      </div>
    </>
  )
}
