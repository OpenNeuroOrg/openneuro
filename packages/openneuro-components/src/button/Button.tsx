import React from 'react'
import './button.scss'

export type ButtonPropsSize = 'xsmall' | 'small' | 'medium' | 'large'

export interface ButtonProps {
  primary?: boolean
  secondary?: boolean
  backgroundColor?: string
  size?: ButtonPropsSize
  label: string
  disabled?: boolean
  onClick?: () => void
  navbar?: boolean
  iconOnly?: boolean
  icon?: string
  color?: string
  imgSrc?: string
  iconSize?: string
  className?: string
  children?: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  primary,
  size = 'medium',
  backgroundColor,
  label,
  navbar = false,
  icon,
  secondary,
  color,
  imgSrc,
  iconSize,
  className,
  children,
  disabled,
  iconOnly,
  type,
  ...props
}: ButtonProps) => {
  const mode =
    primary && !navbar
      ? 'on-button--primary'
      : secondary && !navbar
      ? 'on-button--secondary'
      : !navbar
      ? 'on-no-background'
      : 'on-button--navbar'
  const iconWithText =
    icon && label && !iconOnly
      ? 'icon-text'
      : imgSrc && label
      ? 'img-icon-text'
      : null
  const fontIcon = icon ? (
    <i style={{ fontSize: iconSize }} className={icon} aria-hidden="true"></i>
  ) : null
  const imgIcon = imgSrc ? (
    <img
      style={{ width: iconSize }}
      src={imgSrc}
      alt={label}
      aria-hidden="true"
    />
  ) : null

  return (
    <button
      disabled={disabled}
      role="button"
      type={type ? type : 'button'}
      className={[
        'on-button',
        `on-button--${size}`,
        mode,
        iconWithText,
        `${className}`,
      ].join(' ')}
      style={{ backgroundColor, color }}
      aria-label={label}
      {...props}>
      {imgIcon}
      {fontIcon}
      {iconOnly ? null : label}
      {children}
    </button>
  )
}
