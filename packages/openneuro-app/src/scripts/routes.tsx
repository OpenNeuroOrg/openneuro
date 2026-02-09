import React, { lazy, Suspense } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { Loading } from "./components/loading/Loading"
import { isAdmin } from "./authentication/admin-user.jsx"

const DatasetQuery = lazy(() => import("./dataset/dataset-query"))
const FaqPage = lazy(() => import("./pages/faq/faq"))
const FrontPageContainer = lazy(() => import("./pages/front-page/front-page"))
const Admin = lazy(() => import("./pages/admin/admin"))
const SearchRoutes = lazy(() => import("./search/search-routes"))
const APIKey = lazy(() => import("./pages/api"))
const ErrorRoute = lazy(() => import("./errors/errorRoute"))
const PETRedirect = lazy(() =>
  import("./pages/pet-redirect").then((module) => ({
    default: module.PETRedirect,
  }))
)
const Citation = lazy(() => import("./pages/citation-page"))
const FourOFourPage = lazy(() => import("./errors/404page"))
const ImportDataset = lazy(() =>
  import("./pages/import-dataset").then((module) => ({
    default: module.ImportDataset,
  }))
)
const DatasetMetadata = lazy(() =>
  import("./pages/metadata/dataset-metadata").then((module) => ({
    default: module.DatasetMetadata,
  }))
)
const TermsPage = lazy(() =>
  import("./pages/terms").then((module) => ({ default: module.TermsPage }))
)
const ImageAttribution = lazy(() =>
  import("./pages/image-attribution").then((module) => ({
    default: module.ImageAttribution,
  }))
)
const UserQuery = lazy(() =>
  import("./users/user-query").then((module) => ({ default: module.UserQuery }))
)
const OrcidLinkPage = lazy(() =>
  import("./pages/orcid-link").then((module) => ({
    default: module.OrcidLinkPage,
  }))
)
const FourOThreePage = lazy(() => import("./errors/403page"))

const AppRoutes: React.VoidFunctionComponent = () => (
  <Suspense fallback={<Loading />}>
    <Routes>
      <Route path="/" element={<FrontPageContainer />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/keygen" element={<APIKey />} />
      <Route path="/datasets/:datasetId/*" element={<DatasetQuery />} />
      <Route path="/search/*" element={<SearchRoutes />} />
      <Route
        path="/admin/*"
        element={isAdmin() ? <Admin /> : <FourOThreePage />}
      />
      <Route path="/error/*" element={<ErrorRoute />} />
      <Route path="/pet" element={<PETRedirect />} />
      <Route path="/cite" element={<Citation />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/image-attribution" element={<ImageAttribution />} />
      <Route path="/import" element={<ImportDataset />} />
      <Route path="/metadata" element={<DatasetMetadata />} />
      <Route path="/public" element={<Navigate to="/search" replace />} />
      <Route path="/orcid-link" element={<OrcidLinkPage />} />
      <Route path="/user/:orcid/*" element={<UserQuery />} />
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
  </Suspense>
)

export default AppRoutes
