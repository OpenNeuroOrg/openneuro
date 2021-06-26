import React from 'react'

import './validation.scss'
export interface ValidationBlockProps {
  children: React.ReactNode
}

export const ValidationBlock: React.FC<ValidationBlockProps> = ({
  children,
}) => {
  return <div className="validation-accordion">{children}</div>
}
