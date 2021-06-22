import React, { FC } from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import SearchContainer from './search-container'
import portalContent from '@openneuro/components'
console.log({ MRIPortalContent })

const SearchRoutes: FC = () => {
  const { path } = useRouteMatch()
  return (
    <Switch>
      <Route exact path={path} component={SearchContainer} />
      <Route
        exact
        path={`${path}/modality/mri`}
        component={() => <SearchContainer portalContent={portalContent.mri} />}
      />
    </Switch>
  )
}
export default SearchRoutes
