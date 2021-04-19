import React from 'react';

import './accordion.scss'

export interface AccordionTabProps {
  children: object;
  tabId: string;
  tabLable: string;
  expandOne: boolean;
  name: string;
}

/**
 * Primary UI component for user interaction
 */
export const AccordionTab: React.FC<AccordionTabProps> = ({
  children,
  tabId,
  tabLable,
  expandOne,
  name,
  ...props
}) => {
  return (
    <div className={children? "on-accordion-tab" : "on-accordion-tab on-accordion-tabs-close"} {...props} >
      <input className="on-accordion-input" type={expandOne ? "radio" : "checkbox"} id={name+'-'+tabId} name={expandOne ? name : null}/>
      <label className="on-accordion-tab-label" htmlFor={name+'-'+tabId}><span>{tabLable}</span></label>
      {children? <div className="on-accordion-tab-content">
        {children}
      </div> : null}
    </div>
  );
};

