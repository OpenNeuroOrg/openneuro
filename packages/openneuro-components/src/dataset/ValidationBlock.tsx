import React from 'react'

export interface ValidationBlockProps {
  children?: React.ReactNode
}

export const ValidationBlock: React.FC<ValidationBlockProps> = ({
  children,
}) => {
  return <div className="validation-accordion">{children}</div>
}
