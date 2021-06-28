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
        exact
        path={`${path}/modality/eeg`}
        render={(): React.ReactNode => (
          <SearchContainer portalContent={portalContent.eeg} />
        )}
      />
      <Route
        exact
        path={`${path}/modality/ieeg`}
        render={(): React.ReactNode => (
          <SearchContainer portalContent={portalContent.ieeg} />
        )}
      />
      <Route
        exact
        path={`${path}/modality/meg`}
        render={(): React.ReactNode => (
          <SearchContainer portalContent={portalContent.meg} />
        )}
      />
      <Route
        exact
        path={`${path}/modality/pet`}
        render={(): React.ReactNode => (
          <SearchContainer portalContent={portalContent.pet} />
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
