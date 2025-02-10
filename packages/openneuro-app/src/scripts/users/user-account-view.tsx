import React, { useState } from "react"
import { useMutation } from "@apollo/client"
import { EditableContent } from "./components/editable-content"
import styles from "./scss/useraccountview.module.scss"
import { GET_USER_BY_ORCID, UPDATE_USER } from "./user-query"
import type { UserAccountViewProps } from "../types/user-types"
import { GitHubAuthButton } from "./github-auth-button"

export const UserAccountView: React.FC<UserAccountViewProps> = ({ user }) => {
  const [userLinks, setLinks] = useState<string[]>(user.links || [])
  const [userLocation, setLocation] = useState<string>(user.location || "")
  const [userInstitution, setInstitution] = useState<string>(
    user.institution || "",
  )
  const [updateUser] = useMutation(UPDATE_USER)

  const handleLinksChange = async (newLinks: string[]) => {
    setLinks(newLinks)
    try {
      await updateUser({
        variables: {
          id: user.orcid,
          links: newLinks,
        },
        refetchQueries: [
          {
            query: GET_USER_BY_ORCID,
            variables: { id: user.orcid },
          },
        ],
      })
    } catch {
      // Error handling can be implemented here if needed
    }
  }

  const handleLocationChange = async (newLocation: string) => {
    setLocation(newLocation)

    try {
      await updateUser({
        variables: {
          id: user.orcid,
          location: newLocation,
        },
        refetchQueries: [
          {
            query: GET_USER_BY_ORCID,
            variables: { id: user.orcid },
          },
        ],
      })
    } catch {
      // Error handling can be implemented here if needed
    }
  }

  const handleInstitutionChange = async (newInstitution: string) => {
    setInstitution(newInstitution)

    try {
      await updateUser({
        variables: {
          id: user.orcid,
          institution: newInstitution,
        },
        refetchQueries: [
          {
            query: GET_USER_BY_ORCID,
            variables: { id: user.orcid },
          },
        ],
      })
    } catch {
      // Error handling can be implemented here if needed
    }
  }
  console.log(user.githubSynced)
  return (
    <div data-testid="user-account-view" className={styles.useraccountview}>
      <h3>Account</h3>
      <ul className={styles.accountDetail}>
        <li>
          <span>Name:</span>
          {user.name}
        </li>
        <li>
          <span>Email:</span>
          {user.email}
        </li>
        <li>
          <span>ORCID:</span>
          {user.orcid}
        </li>
        {user.github &&
          (
            <li>
              <span>GitHub:</span>
              {user.github}
            </li>
          )}
        <li>
          <GitHubAuthButton sync={user.githubSynced} />
        </li>
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
