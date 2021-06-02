import React, { FC, useState, useEffect } from 'react'
import { Header } from '@openneuro/components'
import { useLocation, useHistory } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { getUnexpiredProfile } from '../authentication/profile'

const HeaderContainer: FC = () => {
  const history = useHistory()

  const { pathname: currentPath } = useLocation()
  const expanded = currentPath === '/'

  const [cookies] = useCookies()
  const profile = getUnexpiredProfile(cookies)

  return (
    <Header profile={profile} expanded={expanded} pushHistory={history.push} />
  )
}

export default HeaderContainer
