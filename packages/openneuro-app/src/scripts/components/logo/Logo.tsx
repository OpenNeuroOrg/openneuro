import React from "react"

import logodh from "../assets/on-dark-horz.svg"
import logodv from "../assets/on-dark.svg"
import logolh from "../assets/on-light-horz.svg"
import logolv from "../assets/on-light.svg"

export interface LogoProps {
  dark?: boolean
  width?: string
  horizontal?: boolean
}

export const Logo: React.FC<LogoProps> = ({
  dark = true,
  width = "225px",
  horizontal = true,
  ...props
}) => {
  const logoStyle = dark && horizontal
    ? logodh
    : horizontal
    ? logolh
    : dark
    ? logodv
    : logolv

  return (
    <div
      className="logo-wrap"
      style={{
        width: width,
        maxWidth: "100%",
      }}
      {...props}
    >
      <img
        src={logoStyle}
        loading="lazy"
        alt="box with connection dots and lines that says openneuro next to it "
      />
    </div>
  )
}
