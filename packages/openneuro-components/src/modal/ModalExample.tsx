import React, { useState } from "react"

import { Button } from "../button/Button"
import { Modal } from "../modal/Modal"

export interface ModalExampleProps {
  closeText: string
  buttonText: string
}

export const ModalExample: React.FC<ModalExampleProps> = ({
  closeText,
  buttonText,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(!isOpen)
  return (
    <>
      <Button size="small" primary onClick={toggle} label={buttonText} />
      <Modal isOpen={isOpen} toggle={toggle} closeText={closeText}>
        <p>This is the content.</p>
      </Modal>
    </>
  )
}
