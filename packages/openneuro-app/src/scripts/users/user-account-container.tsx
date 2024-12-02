import React from "react"
import { Link } from "react-router-dom"

export interface AccountContainerProps {
  user
}


const UserAccountContainer: React.FC<AccountContainerProps> = ({ user }) => {

  return (
    <>
        <div className="user-info">
            <div className="user-account-card">{user.id}</div>
        <div className="user-account-tab-links">ComponentsLinks to datasets, account, and notifications
            <Link to={'account'}> Test </Link>
        </div>
        </div>
        
        <div className="user-views">Diff views go here</div>
    </>
  )
}

export default UserAccountContainer
