import React from 'react'
import PropTypes from 'prop-types'
import { Switch, NavLink, Redirect, Route, withRouter } from 'react-router-dom'
import DatasetQuery from './datasets/dataset-query.jsx'
import styled from '@emotion/styled'

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1.5em;
  flex: 1 1;
`

const FlexUl = styled.ul`
  flex: 0 1;
`

const Dashboard = ({ public: isPublic }) => {
  const prefix = isPublic ? '/public' : '/dashboard'
  return (
    <DashboardWrapper>
      <FlexUl className="nav nav-pills tabs">
        <li>
          <NavLink to={prefix + '/datasets'} className="btn-tab">
            {isPublic ? 'Public' : 'My'} Datasets
          </NavLink>
        </li>
      </FlexUl>
      <Switch>
        <Redirect path="/dashboard" to="/dashboard/datasets" exact />
        <Route
          name="datalad-datasets-dashboard"
          path={prefix + '/datasets'}
          component={() => <DatasetQuery public={isPublic} />}
        />
      </Switch>
    </DashboardWrapper>
  )
}

Dashboard.propTypes = {
  public: PropTypes.bool,
}

export default withRouter(Dashboard)
