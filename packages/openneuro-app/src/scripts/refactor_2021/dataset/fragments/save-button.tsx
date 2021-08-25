import React, { FC } from 'react'
import { Button } from '@openneuro/components/button'

/**
 * An Save button, calls action when clicked
 */
interface SaveButtonProps {
  action: () => void
}
export const SaveButton: FC<SaveButtonProps> = ({ action }) => {
  return (
    <Button
      label="Save"
      icon="fa-Save"
      onClick={async cb => {
        await action()
        cb()
      }}
    />
  )
}
