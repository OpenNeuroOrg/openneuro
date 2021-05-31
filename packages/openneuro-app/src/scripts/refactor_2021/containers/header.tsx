import React, { FC } from 'react'
import { Header } from '@openneuro/components'
import { useLocation } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { getUnexpiredProfile } from '../authentication/profile'

const HeaderContainer: FC = () => {
  const { pathname: currentPath } = useLocation()
  const expanded = currentPath === '/'

  const [cookies] = useCookies()
  const profile = getUnexpiredProfile(cookies)

  return <Header profile={profile} expanded={expanded} />
}

export default HeaderContainer
