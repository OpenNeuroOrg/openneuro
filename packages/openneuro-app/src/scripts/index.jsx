// dependencies --------------------------------------------------------------

import React from 'react'
import Navbar from './nav/navbar.jsx'
import Happybrowser from './common/partials/happybrowser.jsx'
import Routes from './routes.jsx'
import Uploader from './uploader/uploader.jsx'

const Index = () => (
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

export default Index
