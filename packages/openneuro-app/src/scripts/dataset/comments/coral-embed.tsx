import React, { useContext, useEffect, useRef } from "react"
import * as Sentry from "@sentry/react"
import { isAdmin } from "../../authentication/admin-user"
import { UserModalOpenCtx } from "../../utils/user-login-modal-ctx"

export const CoralEmbed: React.FC<{ storyID: string; modalities: [] }> = (
  { storyID, modalities },
) => {
  const coralContainerRef = useRef<HTMLDivElement>(null)
  const isAdminUser = isAdmin()
  const { setUserModalOpen } = useContext(UserModalOpenCtx)

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
        initializeCoralEmbed(data.token)
      } catch (error) {
        Sentry.captureException(error)
        initializeCoralEmbed(undefined)
      }
    }

    const initializeCoralEmbed = (token: string | undefined) => {
      if (coralContainerRef.current && window.Coral) {
        window.Coral.createStreamEmbed({
          id: coralContainerRef.current.id,
          autoRender: true,
          rootURL: "http://localhost:5001",
          storyID: storyID,
          storyURL: window.location.href,
          accessToken: token,
          role: isAdminUser ? "ADMIN" : "COMMENTER",
          containerClassName: modalities,
          events: function (events) {
            events.on("loginPrompt", function () {
              setUserModalOpen(true)
            })
          },
        })
      }
    }
    fetchAndInitializeCoral()
  }, [storyID, isAdminUser, setUserModalOpen])

  return <div id="coral_thread" ref={coralContainerRef}></div>
}
