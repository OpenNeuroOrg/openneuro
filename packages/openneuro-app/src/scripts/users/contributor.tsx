// components/SingleContributorDisplay.tsx
import React, { FC } from "react"
import { Link } from "react-router-dom"
import { useUser } from "../queries/user"
import type { Contributor } from "../types/datacite"
import ORCIDiDLogo from "../../assets/ORCIDiD_iconvector.svg"

interface SingleContributorDisplayProps {
  contributor: Contributor
  isLast: boolean
  separator: React.ReactNode
}

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

  const userExists = !!user?.id
  // TODO add event to allow user to approve attribution and if userApproved response allow linking to profile
  const userApproved = false
  return (
    <>
      {contributor.orcid && userExists && userApproved
        ? <Link to={`/user/${contributor.orcid}`}>{displayName}</Link>
        : displayName}
      {contributor.orcid && userApproved && (
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
