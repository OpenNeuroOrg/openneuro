import React, { FunctionComponent } from 'react'
import { Media } from '../../styles/media'

/**
 * This is janky but provided for backwards compatibility until new styling is ready
 */
export const MobileClass: FunctionComponent = ({ children }) => (
  <>
    <Media at="small">
      <div className="mobile-class">{children}</div>
    </Media>
    <Media greaterThanOrEqual="medium">
      <div className="col-xs-6">{children}</div>
    </Media>
  </>
)
