import React, { useEffect, useRef } from "react"
import "./dropdown.scss"

export interface DropdownProps {
  label: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const Dropdown = ({ children, label, className }: DropdownProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const wrapperRef = useRef(null)
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen((_prevIsOpen) => false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [wrapperRef])

  return (
    <div className={className + " dropdown-wrapper"} ref={wrapperRef}>
      <div
        className={`toggle ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen((prevIsOpen) => !prevIsOpen)}
      >
        <span>{label}</span>
      </div>
      <div className={`menu ${isOpen ? "expanded" : "collapsed"}`} role="menu">
        {children}
      </div>
    </div>
  )
}
