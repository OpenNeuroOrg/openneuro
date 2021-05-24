import React from 'react'
import './count-toggle.scss'
import { Tooltip } from '../tooltip/Tooltip'
import { Button } from '../button/Button'

export interface CountToggleProps {
  label?: string
  icon?: string
  disabled?: boolean
  tooltip?: string
  onClick?: () => void
  lock?: boolean
  displayOptions: boolean
  setDisplayOptions: (boolean) => void
  count: number
}
export const CountToggle = ({
  label,
  icon,
  disabled,
  tooltip,
  onClick,
  displayOptions,
  setDisplayOptions,
  count,
}: CountToggleProps) => {
  const toggleClick = () => {
    onClick()
    setDisplayOptions(!displayOptions)
  }

  const toggleButton = (
    <span className={disabled ? ' disabled toggle-counter' : 'toggle-counter'}>
      <Button
        className={displayOptions ? 'toggle-btn active' : 'toggle-btn'}
        iconSize="12px"
        icon={'fa ' + icon}
        onClick={() => toggleClick()}
        disabled={disabled}>
        {label} <span>{count}</span>
      </Button>
    </span>
  )

  return (
    <div className="toggle-counter-wrap">
      {tooltip ? (
        <Tooltip flow="up" tooltip={tooltip}>
          {toggleButton}
        </Tooltip>
      ) : (
        toggleButton
      )}
    </div>
  )
}
