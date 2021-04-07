import React, { FC, ReactElement, ReactNode, useState } from 'react'

interface DropdownButtonProps {
  id: string
  title: string | ReactNode
  children: ReactNode
}

/**
 * Replacement for react-bootstrap 0.31.0 DropdownButton
 * Only covers the OpenNeuro use case
 */
export const DropdownButton: FC<DropdownButtonProps> = ({
  id,
  title,
  children,
}): ReactElement => {
  const [open, setOpen] = useState(false)
  const onClick = (): void => {
    setOpen(!open)
  }
  const computedClasses = `dropdown btn-group${open ? ' open' : ''}`
  return (
    <div className={computedClasses}>
      <button
        id={id}
        className="dropdown-toggle btn btn-default"
        role="button"
        aria-haspopup
        aria-expanded={open}
        type="button"
        onClick={onClick}>
        {title}
      </button>
      {open && (
        <ul className="dropdown-menu" aria-labelledby={id} role="menu">
          {children}
        </ul>
      )}
    </div>
  )
}
