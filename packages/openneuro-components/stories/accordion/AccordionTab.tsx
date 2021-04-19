import React from 'react';

import {Icon} from '../icon/Icon'

import './accordion.scss'

export interface AccordionTabProps {
  children: object;
  tabId: string;
  className:string;
  tabLable: string;
  plainStyle: boolean;
  accordionStyle: 'plain' | 'file-tree' | 'bids-wrappper';
}

/**
 * Primary UI component for user interaction
 */
export const AccordionTab: React.FC<AccordionTabProps> = ({
  children,
  tabId,
  plainStyle,
  tabLable,
  className,
  accordionStyle,
  ...props
}) => {
  const [isOpen, setOpen] = React.useState(false);
  const isFileTree = accordionStyle == 'file-tree'
  const fileTreeIcon = isFileTree ? <Icon className="file-icon" icon={isOpen ? "fas fa-folder-open" : "fas fa-folder"} /> : null
  const plain = accordionStyle === 'plain' || 'file-tree' ? (
  <span className={`${accordionStyle}` + ' ' + `${className}`} id={tabId} >
    <div 
      className={`accordion-title ${isOpen ? "open" : ""}` } 
      onClick={() => setOpen(!isOpen)}
    >
       {fileTreeIcon} {tabLable}
    </div>
    <div className={`accordion-item ${!isOpen ? "collapsed" : ""}`}>
      <div className="accordion-content">
        {children}
      </div>
    </div>
  </span> )
  : null


  return (
    <>
      {plain}
    </>
  );
};

