import React, { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import SearchContainer from './search-container'
import { portalContent } from '@openneuro/components/mock-content'

const SearchRoutes: FC = () => (
  <Routes>
    <Route path="/" element={<SearchContainer />} />
    <Route
      path="modality/mri"
      element={<SearchContainer portalContent={portalContent.mri} />}
    />
    <Route
      path="modality/eeg"
      element={<SearchContainer portalContent={portalContent.eeg} />}
    />
    <Route
      path="modality/ieeg"
      element={<SearchContainer portalContent={portalContent.ieeg} />}
    />
    <Route
      path="modality/meg"
      element={<SearchContainer portalContent={portalContent.meg} />}
    />
    <Route
      path="modality/pet"
      element={<SearchContainer portalContent={portalContent.pet} />}
    />
  </Routes>
)
export default SearchRoutes
