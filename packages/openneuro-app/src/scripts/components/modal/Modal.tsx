import React from "react"
import { Button } from "@openneuro/components/button"
import "./modal.scss"

export interface ModalProps {
  children?: React.ReactNode
  isOpen?: boolean
  toggle?: () => void
  closeText?: string
  className?: string
}

export const Modal: React.FC<ModalProps> = ({
  children,
  isOpen,
  toggle,
  closeText,
  className,
}) => {
  const showModal = isOpen ? "show-modal" : "hide-modal"
  return (
    <div className={"modal-wrapper " + showModal + " " + className}>
      <div className="overlay" onClick={toggle}></div>

      <div className="grid modal">
        <div className="col">
          <span className="modal-close-x" onClick={toggle}>
            &times;
          </span>
          <div className="grid modal-body">
            <div className="col">{children}</div>
          </div>
          {closeText
            ? (
              <div className="grid grid-end">
                <div className="m-b-20 m-r-20">
                  <Button
                    className="modal-close-button"
                    size="small"
                    onClick={toggle}
                    label={closeText}
                  />
                </div>
              </div>
            )
            : null}
        </div>
      </div>
    </div>
  )
}
