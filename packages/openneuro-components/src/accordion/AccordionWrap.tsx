import React from 'react'

export interface AccordionWrapProps {
  children: React.ReactNode
  className?: string
}

/**
 * Primary UI component for user interaction
 */
export const AccordionWrap: React.FC<AccordionWrapProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={className + ' on-accordion-wrapper'} {...props}>
      {children}
    </div>
  )
}
