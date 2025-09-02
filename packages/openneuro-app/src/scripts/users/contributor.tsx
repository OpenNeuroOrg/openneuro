import React from "react"
import type { FC } from "react"
import { Link } from "react-router-dom"
import { useUser } from "../queries/user"
import type { Contributor } from "../types/datacite"
import ORCIDiDLogo from "../../assets/ORCIDiD_iconvector.svg"

interface SingleContributorDisplayProps {
  contributor: Contributor
  isLast: boolean
  separator: React.ReactNode
}

/**
 * Displays a single contributor's name and ORCID link.
 * Conditionally links the name to a user profile if a user with the ORCID exists.
 */
export const SingleContributorDisplay: FC<SingleContributorDisplayProps> = ({
  contributor,
  isLast,
  separator,
}) => {
  const { user, loading } = useUser(contributor.orcid || undefined)
  const displayName = contributor.name || "Unknown Contributor"
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
      {contributor.orcid && userExists
        ? (
          <Link to={`/user/${contributor.orcid}`}>
            {displayName}
          </Link>
        )
        : displayName}

      {contributor.orcid && (
        <>
          {" "}
          <a
            href={`${orcidBaseURL}${contributor.orcid}`}
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
