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
      <Route
        exact
        path={`${path}/modality/eeg`}
        render={() => <SearchContainer portalContent={portalContent.eeg} />}
      />
      <Route
        exact
        path={`${path}/modality/ieeg`}
        render={() => <SearchContainer portalContent={portalContent.ieeg} />}
      />
      <Route
        exact
        path={`${path}/modality/meg`}
        render={() => <SearchContainer portalContent={portalContent.meg} />}
      />
      <Route
        exact
        path={`${path}/modality/pet`}
        render={() => <SearchContainer portalContent={portalContent.pet} />}
      />
    </Switch>
  )
}
export default SearchRoutes
