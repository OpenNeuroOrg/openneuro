/**
 * Route for nice display of backend errors
 */
import React from "react"
import { Route, Routes } from "react-router-dom"
import OrcidGeneral from "./orcid/general.jsx"
import { OrcidEmailWarning } from "./orcid/email-warning.js"
import FourOFourPage from "./404page.js"
import FourOThreePage from "./403page.js"

function ErrorRoute() {
  return (
    <div className="container errors">
      <div className="panel">
        <Routes>
          <Route path="github" element={<FourOThreePage />} />
          <Route path="orcid" element={<OrcidGeneral />} />
          <Route path="orcid/unknown" element={<OrcidGeneral />} />
          <Route path="email-warning" element={<OrcidEmailWarning />} />
          <Route path="*" element={<FourOFourPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default ErrorRoute
