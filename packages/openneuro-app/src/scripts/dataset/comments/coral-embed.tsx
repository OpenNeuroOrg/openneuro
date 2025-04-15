import React, { useEffect, useRef } from "react"

declare global {
  interface Window {
    Coral?: {
      createStreamEmbed: (config: any) => void
    }
  }
}

export const CoralEmbed: React.FC<{ storyID: string }> = ({ storyID }) => {
  const coralContainerRef = useRef<HTMLDivElement>(null)
  const coralApiToken = "<TOKEN>"

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "http://localhost:5001/assets/js/embed.js"
    script.async = true
    script.defer = true
    script.onload = () => {
      console.log("Coral embed.js loaded.")
      if (coralContainerRef.current && window.Coral) {
        console.log("Initializing Coral Embed without authentication.")
        window.Coral.createStreamEmbed({
          id: coralContainerRef.current.id,
          autoRender: true,
          rootURL: "http://localhost:5001",
          storyID: storyID,
          storyURL: window.location.href,
          accessToken: coralApiToken,
        })
      } else {
        console.log("Coral object not available after load or ref missing.")
      }
    }
    script.onerror = () => {
      console.error("Failed to load Coral embed.js")
    }
    document.head.appendChild(script)

    return () => {
      const scripts = document.querySelectorAll(`script[src="${script.src}"]`)
      scripts.forEach((s) => s.remove())
    }
  }, [storyID, coralApiToken])

  return <div id="coral_thread" ref={coralContainerRef}></div>
}
