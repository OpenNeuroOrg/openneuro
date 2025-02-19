import React from "react"
import { Navigate, Route, Routes } from "react-router-dom"

// TODO - Re-enable code splitting these when we can
import DatasetQuery from "./dataset/dataset-query"
//import PreRefactorDatasetProps from './dataset/dataset-pre-refactor-container'

import FaqPage from "./pages/faq/faq"
import FrontPageContainer from "./pages/front-page/front-page"
import Admin from "./pages/admin/admin"
import SearchRoutes from "./search/search-routes"
import APIKey from "./pages/api"
import ErrorRoute from "./errors/errorRoute"
import { PETRedirect } from "./pages/pet-redirect"
import Citation from "./pages/citation-page"
import FourOFourPage from "./errors/404page"
import { ImportDataset } from "./pages/import-dataset"
import { DatasetMetadata } from "./pages/metadata/dataset-metadata"
import { TermsPage } from "./pages/terms"
import { ImageAttribution } from "./pages/image-attribution"
import { UserQuery } from "./users/user-query"
import LoggedIn from "../scripts/authentication/logged-in"
import LoggedOut from "../scripts/authentication/logged-out"
import FourOThreePage from "./errors/403page"

const AppRoutes: React.VoidFunctionComponent = () => (
  <Routes>
    <Route path="/" element={<FrontPageContainer />} />
    <Route path="/faq" element={<FaqPage />} />
    <Route path="/keygen" element={<APIKey />} />
    <Route path="/datasets/:datasetId/*" element={<DatasetQuery />} />
    <Route path="/search/*" element={<SearchRoutes />} />
    <Route path="/admin/*" element={<Admin />} />
    <Route path="/error/*" element={<ErrorRoute />} />
    <Route path="/pet" element={<PETRedirect />} />
    <Route path="/cite" element={<Citation />} />
    <Route path="/terms" element={<TermsPage />} />
    <Route path="/image-attribution" element={<ImageAttribution />} />
    <Route path="/import" element={<ImportDataset />} />
    <Route path="/metadata" element={<DatasetMetadata />} />
    <Route path="/public" element={<Navigate to="/search" replace />} />
    <Route
      path="/user/:orcid/*"
      element={
        <>
          <LoggedIn>
            <UserQuery />
          </LoggedIn>
          <LoggedOut>
            <FourOThreePage />
          </LoggedOut>
        </>
      }
    />
    <Route
      path="/saved"
      element={<Navigate to="/search?bookmarks" replace />}
    />
    <Route
      path="/dashboard"
      element={<Navigate to="/search?mydatasets" replace />}
    />
    <Route path="/*" element={<FourOFourPage />} />
  </Routes>
)

export default AppRoutes
