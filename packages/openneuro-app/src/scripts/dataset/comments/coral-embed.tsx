import React, { useEffect, useRef } from "react"

export const CoralEmbed: React.FC<{ storyID: string }> = ({ storyID }) => {
  const coralContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchAndInitializeCoral = async () => {
      const accessToken = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("accessToken="))
        ?.split("=")[1]
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {}

      try {
        const response = await fetch("/api/auth/coral-sso", { headers })
        const data = await response.json()
        console.log("Coral SSO token fetched:", data.token)
        initializeCoralEmbed(data.token)
      } catch (error) {
        console.error("Error fetching Coral SSO token:", error)
        initializeCoralEmbed(undefined)
      }
    }

    const initializeCoralEmbed = (token: string | undefined) => {
      if (coralContainerRef.current && window.Coral) {
        console.log(
          "Initializing Coral Embed with token:",
          token || "undefined",
        )
        window.Coral.createStreamEmbed({
          id: coralContainerRef.current.id,
          autoRender: true,
          rootURL: "http://localhost:5001",
          storyID: storyID,
          storyURL: window.location.href,
          accessToken: token,
        })
      }
    }
    fetchAndInitializeCoral()
  }, [storyID])

  return <div id="coral_thread" ref={coralContainerRef}></div>
}
