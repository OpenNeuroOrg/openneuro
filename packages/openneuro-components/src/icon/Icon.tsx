import React, { ReactNode } from "react"

export interface IconProps {
  primary?: boolean
  secondary?: boolean
  backgroundColor?: string
  label?: string | number | ReactNode
  disabled?: boolean
  icon?: string
  color?: string
  imgSrc?: string
  iconSize?: string
  className?: string
  iconOnly?: boolean
}

export const Icon: React.FC<IconProps> = ({
  backgroundColor,
  label = "",
  icon,
  color,
  imgSrc,
  iconSize,
  className,
  iconOnly,
}) => {
  const iconWithText = icon && label && !iconOnly
    ? "icon-text"
    : imgSrc && label
    ? "img-icon-text"
    : null
  const fontIcon = icon
    ? <i style={{ fontSize: iconSize }} className={icon}></i>
    : null
  const imgIcon = imgSrc
    ? <img style={{ width: iconSize }} src={imgSrc} alt="" loading="lazy" />
    : null
  const wBackgroundColor = backgroundColor ? "has-bg-color" : null

  return (
    <span
      className={[className, "on-icon", iconWithText, wBackgroundColor].join(
        " ",
      )}
      style={{ backgroundColor, color }}
      role="img"
      aria-label={label.toString()}
    >
      {imgIcon}
      {fontIcon}
      {iconOnly ? null : label}
    </span>
  )
}
