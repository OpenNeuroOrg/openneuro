// dependencies --------------------------------------------------------------

import React from 'react'
import Navbar from './nav/navbar.jsx'
import Happybrowser from './common/partials/happybrowser.jsx'
import Routes from './routes.jsx'
import Uploader from './uploader/uploader.jsx'
import { expiringBanner } from './utils/userNotify.js'

const Index = () => {
  expiringBanner(
    'OpenNeuro will be unavailable for approximately 1 hour for planned maintenance on Wednesday, July 17th at 19:00 UTC',
    new Date(1563519600 * 1000), // Friday, July 19th
  )
  return (
    <Uploader>
      <div className="page">
        <Happybrowser />
        <div className="main">
          <Navbar />
          <Routes />
        </div>
      </div>
    </Uploader>
  )
}

export default Index
