import React from 'react'
import { Dropdown } from '../dropdown/Dropdown'
import { Button } from '../button/Button'

export interface CloneDropdownProps {
  gitAccess: React.ReactNode
}

export const CloneDropdown: React.FC<CloneDropdownProps> = ({ gitAccess }) => {
  return (
    <div className="clone-dropdown">
      <Dropdown
        label={
          <Button className="clone-link" primary={true} label="Clone">
            <i className="fas fa-caret-up"></i>
            <i className="fas fa-caret-down"></i>
          </Button>
        }>
        <div>
          <span>{gitAccess}</span>
        </div>
      </Dropdown>
    </div>
  )
}
