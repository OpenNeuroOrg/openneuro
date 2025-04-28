import React from "react"
import type { FC } from "react"
import { Button } from "../../components/button/Button"

/**
 * An edit button, calls action when clicked
 */
interface CancelButtonProps {
  action: () => void
}
export const CancelButton: FC<CancelButtonProps> = ({ action }) => {
  return (
    <Button
      className="description-btn description-button-cancel"
      label="Cancel"
      icon="fas fa-times"
      onClick={() => action()}
    />
  )
}
