import React, { FC } from 'react'
import { Button } from '@openneuro/components/button'

/**
 * An edit button, calls action when clicked
 */
interface EditButtonProps {
  action: () => void
}
export const EditButton: FC<EditButtonProps> = ({ action }) => {
  return (
    <Button
      className="description-btn description-button-edit"
      label="Edit"
      icon="fas fa-edit"
      onClick={() => action()}
    />
  )
}
