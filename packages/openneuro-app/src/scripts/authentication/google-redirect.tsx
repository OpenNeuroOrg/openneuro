import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useUser } from "../queries/user"

/**
 * Redirects Google-authenticated users to the ORCID linking page.
 * Renders nothing — just runs the redirect effect when the user query resolves.
 */
export function GoogleOrcidRedirect() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading, error } = useUser()

  useEffect(() => {
    if (
      !loading &&
      !error &&
      location.pathname !== "/orcid-link" &&
      user?.provider === "google"
    ) {
      navigate("/orcid-link")
    }
  }, [location.pathname, user, loading, error, navigate])

  return null
}
