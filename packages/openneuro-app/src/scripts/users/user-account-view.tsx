import React, { useState } from "react"
import * as Sentry from "@sentry/react"
import { useMutation } from "@apollo/client"
import { EditableContent } from "./components/editable-content"
import { GET_USER, UPDATE_USER } from "../queries/user"
import styles from "./scss/useraccountview.module.scss"
import type { UserAccountViewProps } from "../types/user-types"

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
        {orcidUser.github
          ? (
            <li>
              <span>GitHub:</span>
              {orcidUser.github}
            </li>
          )
          : <li>Connect your GitHub</li>}
      </ul>

      <EditableContent
        editableContent={userLinks}
        setRows={handleLinksChange}
        className="custom-class"
        heading="Links"
        // eslint-disable-next-line no-useless-escape
        validation={/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/} // URL validation regex
        validationMessage="Invalid URL format. Please use a valid link."
        data-testid="links-section"
      />

      <EditableContent
        editableContent={userLocation}
        setRows={handleLocationChange}
        className="custom-class"
        heading="Location"
        data-testid="location-section"
      />
      <EditableContent
        editableContent={userInstitution}
        setRows={handleInstitutionChange}
        className="custom-class"
        heading="Institution"
        data-testid="institution-section"
      />
    </div>
  )
}
