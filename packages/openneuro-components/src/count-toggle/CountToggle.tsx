import React from 'react'
import './count-toggle.scss'
import { Tooltip } from '../tooltip/Tooltip'
import { Button } from '../button/Button'
import { Modal } from '../modal/Modal'

export interface CountToggleProps {
  label?: string
  icon?: string
  disabled?: boolean
  tooltip?: string
  toggleClick?: () => void
  lock?: boolean
  clicked: boolean
  showClicked: (boolean) => void
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
  const toggleLogin = () => alert('TODO needs login modal')
  const toggleButton = (
    <span className="toggle-counter">
      <Button
        className={clicked ? 'toggle-btn active' : 'toggle-btn'}
        iconSize="12px"
        icon={'fa ' + icon}
        onClick={toggleClick}>
        {label} <span>{count}</span>
      </Button>
    </span>
  )
  const disabledToggleButton = (
    <span className="toggle-counter disabled">
      <Button
        className={clicked ? 'toggle-btn active' : 'toggle-btn'}
        iconSize="12px"
        icon={'fa ' + icon}
        onClick={toggleLogin}>
        {label} <span>{count}</span>
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
