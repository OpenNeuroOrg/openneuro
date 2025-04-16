import React, { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    Coral?: {
      createStreamEmbed: (config: any) => void
    }
  }
}

export const CoralEmbed: React.FC<{ storyID: string }> = ({ storyID }) => {
  const coralContainerRef = useRef<HTMLDivElement>(null)
  const [coralSSOToken, setCoralSSOToken] = useState<string | null>(null)
  const isAuthenticated = document.cookie.includes("accessToken=")

  useEffect(() => {
    const fetchAndInitializeCoral = async () => {
      const accessTokenFromCookie = document.cookie.split("; ").find((cookie) =>
        cookie.startsWith("accessToken=")
      )?.split("=")[1]
      const headers = accessTokenFromCookie
        ? { Authorization: `Bearer ${accessTokenFromCookie}` }
        : {}

      try {
        const response = await fetch("/api/auth/coral-sso", { headers })
        const data = await response.json()
        setCoralSSOToken(data.token)
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

    const script = document.createElement("script")
    script.src = "http://localhost:5001/assets/js/embed.js"
    script.async = true
    script.defer = true
    script.onload = fetchAndInitializeCoral
    script.onerror = () => console.error("Failed to load Coral embed.js")
    document.head.appendChild(script)

    return () => {
      document.querySelectorAll(`script[src="${script.src}"]`).forEach((s) =>
        s.remove()
      )
    }
  }, [storyID])

  return <div id="coral_thread" ref={coralContainerRef}></div>
}
