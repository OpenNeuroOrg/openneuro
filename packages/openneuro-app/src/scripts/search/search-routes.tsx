import React from "react"
import type { FC } from "react"
import { Route, Routes } from "react-router-dom"
import SearchContainer from "./search-container"
import { portalContent } from "@openneuro/components/content"

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
    <Route
      path="modality/nih"
      element={<SearchContainer portalContent={portalContent.nih} />}
    />
  </Routes>
)
export default SearchRoutes
