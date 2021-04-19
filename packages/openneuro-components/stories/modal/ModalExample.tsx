import React, { useState } from 'react'

import { Button } from '../button/Button'
import { Modal } from '../modal/Modal'

export interface ModalExampleProps {

}

export const ModalExample: React.FC<ModalExampleProps> = ({
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <>
      <Button
        size='small'
        primary
        onClick={toggle}
        label="Click Me"
      />
      <Modal isOpen={isOpen} toggle={toggle} closeText="Now Close">
        <p>This is the content.</p>
      </Modal>
    </>
  )
}
