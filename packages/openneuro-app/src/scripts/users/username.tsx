import React from "react"
import ORCIDiDLogo from "../../assets/ORCIDiD_iconvector.svg"
import { config } from "../config"
import { Link } from "react-router-dom"

/**
 * Display component for usernames showing ORCID linking if connected
 */
export const Username = ({ user }): JSX.Element => {
  if (user.orcid) {
    let orcidURL = "https://orcid.org/"
    if (config.auth.orcid.ORCID_API_ENDPOINT.includes("sandbox")) {
      orcidURL = "https://sandbox.orcid.org/"
    }
    return (
      <>
        <Link to={`/user/${user.orcid}`}>{user.name}</Link>{" "}
        <a href={`${orcidURL}${user.orcid}`}>
          <img src={ORCIDiDLogo} width="16" height="16" alt="ORCID logo" />
        </a>
      </>
    )
  } else {
    return user.name as JSX.Element
  }
}
