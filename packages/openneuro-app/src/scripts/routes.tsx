import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'

const DatasetQuery = React.lazy(() => import('./dataset/dataset-query'))
const FaqPage = React.lazy(() => import('./pages/faq/faq'))
const FrontPageContainer = React.lazy(
  () => import('./pages/front-page/front-page'),
)
const Admin = React.lazy(() => import('./pages/admin/admin'))
const SearchRoutes = React.lazy(() => import('./search/search-routes'))
const APIKey = React.lazy(() => import('./pages/api'))
const ErrorRoute = React.lazy(() => import('./errors/errorRoute'))
const PETRedirect = React.lazy(() => import('./pages/pet-redirect'))
const Citation = React.lazy(() => import('./pages/citation-page'))
const FourOFourPage = React.lazy(() => import('./errors/404page'))
const ImportDataset = React.lazy(() => import('./pages/import-dataset'))

const AppRoutes: React.VoidFunctionComponent = () => (
  <React.Suspense fallback={<></>}>
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
      <Route path="/import" element={<ImportDataset />} />
      <Route path="/public" element={<Navigate to="/search" replace />} />
      <Route
        path="/saved"
        element={<Navigate to="/search?bookmarks" replace />}
      />
      <Route
        path="/dashboard"
        element={<Navigate to="/search?mydatasets" replace />}
      />
      <Route element={<FourOFourPage />} />
    </Routes>
  </React.Suspense>
)

export default AppRoutes
