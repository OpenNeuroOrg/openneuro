import React from "react"
import { Link } from "react-router-dom"
import { useUser } from "../queries/user"
import type { Contributor } from "../types/datacite"
import ORCIDiDLogo from "../../assets/ORCIDiD_iconvector.svg"

interface SingleContributorDisplayProps {
  contributor: Contributor & {
    resolutionStatus?: "pending" | "accepted" | "denied"
  }
  isLast: boolean
  separator: React.ReactNode
}

export const SingleContributorDisplay: React.FC<SingleContributorDisplayProps> =
  ({ contributor, isLast, separator }) => {
    const { user, loading } = useUser(contributor.orcid || undefined)

    const displayName = contributor.familyName
      ? `${contributor.familyName}, ${contributor.givenName || ""}`.trim()
      : contributor.name || "Unknown Contributor"

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

    // TODO get resolutionStatus from event/contributor
    const resolutionAccepted = true //contributor.resolutionStatus === "accepted"

    return (
      <>
        {contributor.orcid && userExists && resolutionAccepted
          ? <Link to={`/user/${contributor.orcid}`}>{displayName}</Link>
          : displayName}
        {contributor.orcid && resolutionAccepted && (
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
