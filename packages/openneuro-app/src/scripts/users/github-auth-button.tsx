import React from "react"

interface GitHubAuthButtonProps {
  sync: Date | null // Define the sync prop type, assuming it's a Date or null
}

export const GitHubAuthButton: React.FC<GitHubAuthButtonProps> = ({ sync }) => {
  const buttonText = sync ? "Re-sync" : "Sync"
  const lastSyncedText = sync ? `Last synced: ${sync.toLocaleString()}` : null

  return (
    <a href="/crn/auth/github" className="btn btn-github">
      {buttonText} user data from GitHub
      {lastSyncedText && <small>- {lastSyncedText}</small>}
    </a>
  )
}
