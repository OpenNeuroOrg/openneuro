// dependencies --------------------------------------------------------------

import React from 'react'
import Navbar from './nav/navbar.jsx'
import Routes from './routes.jsx'
import Uploader from './uploader/uploader.jsx'

const Index = () => {
  return (
    <Uploader>
      <div className="page">
        <div className="main">
          <Navbar />
          <Routes />
        </div>
      </div>
    </Uploader>
  )
}

export default Index
