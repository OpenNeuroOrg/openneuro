import React from 'react'
import Navbar from './nav/navbar.jsx'
import Routes from './routes'
import Uploader from './uploader/uploader.jsx'

//import('../sass/main.scss')
const Classic = (): React.ReactElement => (
  <Uploader>
    <div className="page">
      <div className="main">
        <Navbar />
        <Routes />
      </div>
    </div>
  </Uploader>
)

export default Classic
