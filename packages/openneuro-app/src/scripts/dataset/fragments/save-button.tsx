import React from "react"
import type { FC } from "react"
import { Button } from "../../components/button/Button"

/**
 * An Save button, calls action when clicked
 */
interface SaveButtonProps {
  action: () => void
}
export const SaveButton: FC<SaveButtonProps> = ({ action }) => {
  return (
    <Button
      className="description-btn description-button-save"
      label="Save"
      icon="fas fa-check"
      onClick={() => action()}
    />
  )
}
