import React, { useEffect, useRef } from "react"

interface CoralEmbedConfig {
  datasetId?: string
}

export const CoralEmbed: React.FC<CoralEmbedConfig> = ({ datasetId }) => {
  const coralContainerRef = useRef<HTMLDivElement>(null)
  const currentURL = window.location.href

  useEffect(() => {
    console.log("CoralEmbed useEffect triggered")
    console.log("containerRef.current:", coralContainerRef.current)
    console.log("window.Coral:", window.Coral)

    if (coralContainerRef.current && window.Coral) {
      console.log("Initializing Coral Embed")
      window.Coral.createStreamEmbed({
        id: coralContainerRef.current.id,
        autoRender: true,
        rootURL: "http://localhost:3000",
        storyID: `${datasetId}`,
        storyURL: currentURL,
      })
    }
  }, [datasetId, currentURL, coralContainerRef])
  return <div id="coral_thread" ref={coralContainerRef}></div>
}
