import React, { useRef, useEffect } from 'react'
import './warn-button.scss'
import { Tooltip } from '../tooltip/Tooltip'
import { Button } from '../button/Button'

export interface WarnButtonProps {
  message?: string
  icon?: string
  disabled?: boolean
  tooltip?: string
  onConfirmedClick?: () => void
  displayOptions: boolean
  setDisplayOptions(cb: (currentState: boolean) => boolean): void
}
export const WarnButton = ({
  message,
  icon,
  disabled,
  tooltip,
  onConfirmedClick,
  displayOptions,
  setDisplayOptions,
}: WarnButtonProps) => {
  const viewAction = (
    <div className="warn-btn-group " role="group">
      <div className="slide-in">
        <Button
          className="btn-warn-component cancel"
          iconSize="12px"
          icon="fa fa-times"
          color="#fff"
          backgroundColor="#c00342"
          onClick={() => setDisplayOptions(currentState => !currentState)}
          size="xsmall"
        />

        <Button
          className="btn-warn-component success"
          iconSize="12px"
          icon="fa fa-check"
          color="#fff"
          backgroundColor="#00b489"
          onClick={() => {
            onConfirmedClick()
            setDisplayOptions(currentState => !currentState)
          }}
          size="xsmall"
        />
      </div>
    </div>
  )

  const hideAction = (
    <span className={disabled ? ' disabled warn-btn-click' : 'warn-btn-click'}>
      <Button
        className="btn-warn-component"
        iconSize="12px"
        icon={'fa ' + icon}
        label={message}
        onClick={() => setDisplayOptions(currentState => !currentState)}
        disabled={disabled}
      />
    </span>
  )

  const button = displayOptions ? viewAction : hideAction

  return (
    <div className="warn-btn">
      {tooltip ? (
        <Tooltip flow="up" tooltip={tooltip}>
          {button}
        </Tooltip>
      ) : (
        button
      )}
    </div>
  )
}
