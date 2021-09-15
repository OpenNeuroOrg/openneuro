import React, { FC } from 'react'
import './warn-button.scss'
import { Tooltip } from '../tooltip/Tooltip'
import { Button } from '../button/Button'

export interface WarnButtonProps {
  message?: string
  icon?: string
  className?: string
  disabled?: boolean
  tooltip?: string
  iconOnly?: boolean
  onConfirmedClick?: () => void
  displayOptions?: boolean
  setDisplayOptions?(cb: (currentState: boolean) => boolean): void
}
export const WarnButton: FC<WarnButtonProps> = ({
  message,
  icon,
  className,
  disabled,
  tooltip,
  iconOnly,
  onConfirmedClick,
  displayOptions,
  setDisplayOptions,
}) => {
  if (displayOptions === undefined || displayOptions === null) {
    ;[displayOptions, setDisplayOptions] = React.useState(false as boolean)
  }
  const viewAction = (
    <div className="warn-btn-group" role="group">
      <div className="slide-in">
        <Button
          className="btn-warn-component cancel"
          iconSize="12px"
          iconOnly={iconOnly}
          icon="fa fa-times"
          color="#fff"
          backgroundColor="#c00342"
          onClick={() => setDisplayOptions(currentState => !currentState)}
          size="xsmall"
          label="cancel"
        />

        <Button
          className="btn-warn-component success"
          iconSize="12px"
          icon="fa fa-check"
          color="#fff"
          iconOnly={iconOnly}
          backgroundColor="#00b489"
          onClick={() => {
            onConfirmedClick()
            setDisplayOptions(currentState => !currentState)
          }}
          size="xsmall"
          label="confirm"
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
    <div className={'warn-btn ' + (className || '')}>
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
