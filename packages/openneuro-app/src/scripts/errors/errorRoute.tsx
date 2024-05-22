/**
 * Route for nice display of backend errors
 */
import React from "react"
import { Route, Routes } from "react-router-dom"
import OrcidGeneral from "./orcid/general.jsx"
import FourOFourPage from "./404page.js"

function ErrorRoute() {
  return (
    <div className="container errors">
      <div className="panel">
        <Routes>
          <Route path="orcid" element={<OrcidGeneral />} />
          <Route path="*" element={<FourOFourPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default ErrorRoute
