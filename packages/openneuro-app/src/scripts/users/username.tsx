import React from 'react'
import ORCIDiDLogo from '../../assets/ORCIDiD_iconvector.svg'

/**
 * Display component for usernames showing ORCID linking if connected
 */
export const Username = ({ user }) => {
  if (user.orcid) {
    return (
      <>
        {user.name}{' '}
        <a href={`https://orcid.org/${user.orcid}`}>
          <img src={ORCIDiDLogo} width="16" height="16" alt="ORCID logo" />
        </a>
      </>
    )
  } else {
    return user.name
  }
}
