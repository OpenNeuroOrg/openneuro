import React, { useState } from "react"
import { useMutation } from "@apollo/client"
import { EditableContent } from "./components/editable-content"
import styles from "./scss/useraccountview.module.scss"
import { GET_USER_BY_ORCID, UPDATE_USER } from "./user-query"

interface UserAccountViewProps {
  user: {
    name: string
    email: string
    orcid: string
    links: string[]
    location: string
    institution: string
    github?: string
  }
}

export const UserAccountView: React.FC<UserAccountViewProps> = ({ user }) => {
  const [userLinks, setLinks] = useState<string[]>(user.links || [])
  const [userLocation, setLocation] = useState<string>(user.location || "")
  const [userInstitution, setInstitution] = useState<string>(
    user.institution || "",
  )
  const [updateUser] = useMutation(UPDATE_USER)

  const handleLinksChange = async (newLinks: string[]) => {
    setLinks(newLinks)
    console.log("Updating links:", newLinks)

    try {
      const result = await updateUser({
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
      console.log("Links mutation result:", result)
    } catch (error) {
      console.error("Failed to update links:", error)
    }
  }

  const handleLocationChange = async (newLocation: string) => {
    setLocation(newLocation)
    console.log("Updating location:", newLocation)

    try {
      const result = await updateUser({
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
      console.log("Location mutation result:", result)
    } catch (error) {
      console.error("Failed to update location:", error)
    }
  }

  const handleInstitutionChange = async (newInstitution: string) => {
    setInstitution(newInstitution)
    console.log("Updating institution:", newInstitution)

    try {
      const result = await updateUser({
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
      console.log("Institution mutation result:", result)
    } catch (error) {
      console.error("Failed to update institution:", error)
    }
  }

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
        {user.github
          ? (
            <li>
              <span>GitHub:</span>
              {user.github}
            </li>
          )
          : <li>Connect your GitHub</li>}
      </ul>

      <EditableContent
        editableContent={userLinks}
        setRows={handleLinksChange}
        className="custom-class"
        heading="Links"
        validation={/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/} // URL validation regex
        validationMessage="Invalid URL format. Please use a valid link."
      />

      <EditableContent
        editableContent={userLocation}
        setRows={handleLocationChange}
        className="custom-class"
        heading="Location"
      />
      <EditableContent
        editableContent={userInstitution}
        setRows={handleInstitutionChange}
        className="custom-class"
        heading="Institution"
      />
    </div>
  )
}
