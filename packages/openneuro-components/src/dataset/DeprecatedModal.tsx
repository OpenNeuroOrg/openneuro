import React from 'react'
import { Modal } from '../modal/Modal'

export interface DeprecatedModalProps {
  isOpen: boolean
  toggle: (boolean) => void
  children: React.ReactNode
  className: string
  closeText: string
}

export const DeprecatedModal: React.FC<DeprecatedModalProps> = ({
  isOpen,
  toggle,
  children,
  className,
  closeText,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      closeText={closeText}
      className={className}>
      {children}
    </Modal>
  )
}
