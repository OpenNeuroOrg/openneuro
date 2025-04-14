import React, { useCallback, useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    Coral?: {
      createStreamEmbed: (config: any) => void
    }
  }
}

export const CoralEmbed: React.FC<{ storyID: string }> = ({ storyID }) => {
  const coralContainerRef = useRef<HTMLDivElement>(null)
  const [coralInitialized, setCoralInitialized] = useState(false)

  const initializeCoralEmbed = useCallback(() => {
    if (coralContainerRef.current && window.Coral) {
      console.log("Initializing Coral Embed (button)")
      window.Coral.createStreamEmbed({
        id: coralContainerRef.current.id,
        autoRender: true,
        rootURL: "http://localhost:5001",
        storyID: storyID,
        storyURL: window.location.href,
      })
      setCoralInitialized(true)
    } else {
      console.log("Coral object not available or ref missing on button click")
    }
  }, [storyID])

  useEffect(() => {
    // No automatic initialization on mount
    console.log("CoralEmbed component mounted.")
  }, [])

  return (
    <div>
      <div id="coral_thread" ref={coralContainerRef}></div>
      {!coralInitialized && (
        <button onClick={initializeCoralEmbed}>Initialize Coral Embed</button>
      )}
      {coralInitialized && <p>Coral Embed Initialized</p>}
    </div>
  )
}
