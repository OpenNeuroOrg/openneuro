import React from 'react'
import './logo.scss'

import logodh from '../assets/on-dark-horz.svg'
import logodv from '../assets/on-dark.svg'
import logolh from '../assets/on-light-horz.svg'
import logolv from '../assets/on-light.svg'

export interface LogoProps {
  dark?: boolean
  width?: string
  horizontal?: boolean
}

export const Logo: React.FC<LogoProps> = ({
  dark = true,
  width = '300px',
  horizontal = true,
  ...props
}) => {
  const colorMode = dark ? 'logo-dark' : 'logo-light'
  const layoutMode = horizontal ? 'logo-horz' : 'logo-vert'

  const logoStyle =
    dark && horizontal ? logodh : horizontal ? logolh : dark ? logodv : logolv

  return (
    <div
      className="logo-wrap"
      style={{
        width: width,
        maxWidth: '100%',
      }}
      {...props}>
      <img
        src={logoStyle}
        alt="box with connection dots and lines that says openneuro next to it "
      />
    </div>
  )
}
