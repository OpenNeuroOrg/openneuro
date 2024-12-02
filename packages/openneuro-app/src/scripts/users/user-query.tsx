import React from 'react'
import * as Sentry from '@sentry/react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { Loading } from '@openneuro/components/loading'
import UserRoutes from './user-routes'
import FourOFourPage from '../errors/404page'
import FourOThreePage from '../errors/403page'

/**
 * Query to load and render USER page - most USER loading is done here
 * @param {Object} props
 * @param {Object} props.user 
 * 
 * 
 * query ExampleQuery($userId: ID!) {
  id
  user(id: $userId) {
    avatar
    email
    id
    name
    orcid
  }
}
 */
export const UserQueryHook = ({ user }) => {
    let error = false
    let loading = false
    const hasEdit = true
    const fakeuser = {
        avatar: null,
        email: 'asdf@asd.com',
        id: '000001',
        name: 'Gregory Noack',
        orcid: '0000-0000-0000-0001',
    }
    user = fakeuser
    if (error) {
        if (error === 'something specific') {
            return <FourOThreePage />
        } else {
            Sentry.captureException(error)
            return <FourOFourPage />
        }
    } else {
        if (loading || !user) {
            return (
                <div className="loading-user">
                    <Loading />
                    Loading User
                </div>
            )
        }
    }

    return <UserRoutes user={user} hasEdit={hasEdit} />
}

/**
 * Routing wrapper for USER query
 *
 * Expects to be a child of a react-router Route component with UserId
 */
const UserQuery = () => {
    const { user } = useParams()
    return (
        <>
            <UserQueryHook user={user} />
        </>
    )
}

UserQuery.propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
}

export default UserQuery
