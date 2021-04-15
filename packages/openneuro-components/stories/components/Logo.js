import React from 'react'
import PropTypes from 'prop-types'
import './logo.scss'

// import logodh from '../assets/on-dark-horz.svg'
// import logodv from '../assets/on-dark.svg'
// import logolh from '../assets/on-light-horz.svg'
// import logolv from '../assets/on-light.svg'

export const Logo = ({ dark, width, horizontal, ...props }) => {
  const logodh = <img src="http://placehold.it/200x200" />
  const logodv = logodh
  const logolh = logodh
  const logolv = logodh
  const colorMode = dark ? 'logo-dark' : 'logo-light'
  const layoutMode = horizontal ? 'logo-horz' : 'logo-vert'

  const logoStyle =
    dark && horizontal ? logodh : horizontal ? logolh : dark ? logodv : logolv

  return (
    <div
      className="logo-wrap"
      style={{
        width: width,
      }}
      {...props}>
      {logoStyle}
    </div>
  )
}

Logo.propTypes = {
  dark: PropTypes.bool,
  width: PropTypes.string,
  horizontal: PropTypes.bool,
  onClick: PropTypes.func,
}

Logo.defaultProps = {
  dark: true,
  width: '300px',
  horizontal: true,
  onClick: undefined,
}
