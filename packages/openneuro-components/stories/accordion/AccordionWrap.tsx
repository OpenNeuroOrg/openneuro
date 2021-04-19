import React from 'react';
import { AccordionTab } from './AccordionTab'

import './accordion.scss'

export interface AccordionWrapProps {
  children: object;
  accordionID: string;
}

/**
 * Primary UI component for user interaction
 */
export const AccordionWrap: React.FC<AccordionWrapProps> = ({
  children,
  accordionID,
  ...props
}) => {
  return (
    <div className="on-accordion-wrapper" {...props} id={accordionID}>
      {children}
    </div>
  );
};

