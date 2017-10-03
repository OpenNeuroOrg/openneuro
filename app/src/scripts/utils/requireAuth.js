// dependencies ----------------------------------------------------

import React from 'react'
import { Redirect } from 'react-router-dom'
import userStore from '../user/user.store.js'

// require auth ----------------------------------------------------

const requireAuth = (Component, role = 'user') => {
  return class Authenticated extends Component {
    render() {
      if (!userStore.data.token) {
        // if not logged in
        return <Redirect to="/" />
      } else if (
        role === 'admin' &&
        (!userStore.data.scitran || !userStore.data.scitran.root)
      ) {
        return <Redirect to="/" />
      }
      return super.render()
    }
  }
}

export default requireAuth
