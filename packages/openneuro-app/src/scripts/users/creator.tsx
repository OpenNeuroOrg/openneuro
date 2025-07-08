import React from "react"
import type { FC } from "react"
import { Link } from "react-router-dom"
import { useUser } from "../queries/user"
import type { Creator } from "../types/creators"
import ORCIDiDLogo from "../../assets/ORCIDiD_iconvector.svg"

interface SingleCreatorDisplayProps {
  creator: Creator
  isLast: boolean
  separator: React.ReactNode
}

/**
 * Displays a single creator's name and ORCID link.
 * Conditionally links the name to a user profile if a user with the ORCID exists.
 */
export const SingleCreatorDisplay: FC<SingleCreatorDisplayProps> = ({
  creator,
  isLast,
  separator,
}) => {
  const { user, loading } = useUser(creator.orcid || undefined)
  const displayName = creator.name || "Unknown Creator"
  const orcidBaseURL = "https://orcid.org/"

  if (loading) {
    return (
      <>
        {displayName} (checking user...)
        {!isLast && separator}
      </>
    )
  }

  // Check if a user was successfully found for this ORCID
  const userExists = !!user?.id

  return (
    <>
      {creator.orcid && userExists
        ? (
          <Link to={`/user/${creator.orcid}`}>
            {displayName}
          </Link>
        )
        : displayName}

      {creator.orcid && (
        <>
          {" "}
          <a
            href={`${orcidBaseURL}${creator.orcid}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`ORCID profile for ${displayName}`}
          >
            <img src={ORCIDiDLogo} width="16" height="16" alt="ORCID logo" />
          </a>
        </>
      )}
      {!isLast && separator}
    </>
  )
}
