import React from "react"
import type { FC } from "react"
import { Button } from "@openneuro/components/button"

/**
 * An edit button, calls action when clicked
 */
interface CloseButtonProps {
  action: () => void
}
export const CloseButton: FC<CloseButtonProps> = ({ action }) => {
  return (
    <Button
      className="description-btn description-button-cancel"
      label="Close"
      icon="fas fa-times"
      onClick={() => action()}
    />
  )
}
