import React from "react"

export interface AccountContainerProps {
  user
}


const UserAccountContainer: React.FC<AccountContainerProps> = ({ user }) => {

  return (
    <>
        <div className="user-info">
            <div className="user-account-card">{user.id}</div>
        <div className="user-account-tab-links">{user.id}</div>
        </div>
        
        <div className="user-views">Diff views go here</div>
    </>
  )
}

export default UserAccountContainer
