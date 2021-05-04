import React, { useRef, useEffect } from 'react'
import './dropdown.scss'

export interface DropdownProps {
  label: Record<string, any>
  children
}

export const Dropdown = ({ children, label }: DropdownProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  console.log(isOpen)

  function removeIsOpen(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsOpen(prevIsOpen => false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [ref])
  }
  const wrapperRef = useRef(null)
  removeIsOpen(wrapperRef)
  return (
    <div className="dropdown-wrapper" ref={wrapperRef}>
      <div
        className={`toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(prevIsOpen => !prevIsOpen)}>
        <span>{label}</span>
      </div>
      <div className={`menu ${isOpen ? 'expanded' : 'collapsed'}`}>
        {children}
      </div>
    </div>
  )
}
