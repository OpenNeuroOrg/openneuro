import React from 'react';
import { Button } from '../button/Button'

import './modal.scss'

export interface ModalProps {
  children?: object;
   isOpen?: boolean; 
   toggle?: () => void;
   closeText: string;
}

/**
 * Primary UI component for user interaction
 */
export const Modal: React.FC<ModalProps> = ({
  children, isOpen, toggle, closeText,
  ...props
}) => {
  const showModal = isOpen ? "show-modal" : "hide-modal"
  return (
    <div className={'modal-wrapper ' + showModal} >
    <div className="overlay" onClick={toggle}></div>

    <div className="modal" isOpen={isOpen} toggle={toggle} >
      <span className="modal-close-x" onClick={toggle}>&times;</span>
      <div className="modal-body">{children}</div>
      <Button
        buttonClass="modal-close-button"
        size='small'
        primary
        onClick={toggle}
        label={closeText}
      />
    </div>
  </div>
  );
};

