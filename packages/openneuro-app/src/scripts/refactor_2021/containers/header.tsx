import React, { FC } from 'react'
import { Header, LandingExpandedHeader } from '@openneuro/components'
import { FrontFacetExample } from '@openneuro/components'
import LandingSearchInput from '../search/inputs/landing-search-input'
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
    <Header
      profile={profile}
      expanded={expanded}
      pushHistory={history.push}
      renderOnExpanded={profile => (
        <LandingExpandedHeader
          profile={profile}
          renderFacetSelect={() => (
            <FrontFacetExample {...FrontFacetExample.args} />
          )}
          renderSearchInput={() => <LandingSearchInput />}
          onSearch={() => history.push('/search')}
        />
      )}
    />
  )
}

export default HeaderContainer
