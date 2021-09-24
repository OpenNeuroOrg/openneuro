import React from 'react'
import { Tooltip } from '../tooltip/Tooltip'
import { Button } from '../button/Button'

export interface CountToggleProps {
  label?: string
  icon?: string
  disabled?: boolean
  tooltip?: string
  toggleClick?: () => void
  lock?: boolean
  clicked: boolean
  count: number
}
export const CountToggle = ({
  label,
  icon,
  disabled,
  tooltip,
  toggleClick,
  clicked,
  count,
}: CountToggleProps) => {
  const toggleButton = (
    <span className="toggle-counter">
      <Button
        className={clicked ? 'toggle-btn active' : 'toggle-btn'}
        iconSize="12px"
        icon={'fa ' + icon}
        onClick={toggleClick}
        label={label}>
        <span className="count-span">{count}</span>
      </Button>
    </span>
  )
  const disabledToggleButton = (
    <span className="toggle-counter disabled">
      <Button
        className={clicked ? 'toggle-btn active' : 'toggle-btn'}
        iconSize="12px"
        icon={'fa ' + icon}
        onClick={toggleClick}
        label={label}>
        <span className="count-span">{count}</span>
      </Button>
    </span>
  )
  const button = disabled ? disabledToggleButton : toggleButton
  return (
    <>
      <div className="toggle-counter-wrap">
        {tooltip ? (
          <Tooltip flow="up" tooltip={tooltip}>
            {button}
          </Tooltip>
        ) : (
          button
        )}
      </div>
    </>
  )
}
