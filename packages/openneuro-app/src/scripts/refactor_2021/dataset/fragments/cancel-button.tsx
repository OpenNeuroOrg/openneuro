import React, { FC } from 'react'
import { Button } from '@openneuro/components/button'

/**
 * An edit button, calls action when clicked
 */
interface CancelButtonProps {
  action: () => void
}
export const CancelButton: FC<CancelButtonProps> = ({ action }) => {
  return <Button label="Cancel" icon="fa-close" onClick={() => action()} />
}
