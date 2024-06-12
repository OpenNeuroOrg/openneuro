import React, { useEffect, useRef } from "react"

export interface DropdownProps {
  label: Record<string, any>
  children: React.ReactNode
  className?: string
}

export const Dropdown = ({ children, label, className }: DropdownProps) => {
  const [isOpen, setIsOpen] = React.useState(false)

  function removeIsOpen(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsOpen((prevIsOpen) => false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [ref])
  }
  const wrapperRef = useRef(null)
  removeIsOpen(wrapperRef)

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
