import React from 'react'
import { Button } from '../button/Button'

import './modal.scss'

export interface ModalProps {
  children?: object
  isOpen?: boolean
  toggle?: () => void
  closeText: string
}

export const Modal: React.FC<ModalProps> = ({
  children,
  isOpen,
  toggle,
  closeText,
  ...props
}) => {
  const showModal = isOpen ? 'show-modal' : 'hide-modal'
  return (
    <div className={'modal-wrapper ' + showModal} {...props}>
      <div className="overlay" onClick={toggle}></div>

      <div className="grid modal">
        <div className="col">
          <span className="modal-close-x" onClick={toggle}>
            &times;
          </span>
          <div className="grid modal-body">
            <div className="col">{children}</div>
          </div>
          {closeText ? (
            <div className="grid grid-end">
              <div className="m-b-20 m-r-20">
                <Button
                  buttonClass="modal-close-button"
                  size="small"
                  onClick={toggle}
                  label={closeText}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
