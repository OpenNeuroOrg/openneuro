import React, { FC } from 'react'
import { Route, Switch, useRouteMatch, Redirect } from 'react-router-dom'
import SearchContainer from './search-container'
import { portalContent } from '@openneuro/components'

const SearchRoutes: FC = () => {
  const { path }: { path: string } = useRouteMatch()
  return (
    <Switch>
      <Route exact path={path} component={SearchContainer} />
      <Route
        exact
        path={`${path}/modality/mri`}
        render={(): React.ReactNode => (
          <SearchContainer portalContent={portalContent.mri} />
        )}
      />
      <Route
        component={(): React.ReactNode => (
          <Redirect to={`${path}/modality/mri`} />
        )}
      />
    </Switch>
  )
}
export default SearchRoutes
