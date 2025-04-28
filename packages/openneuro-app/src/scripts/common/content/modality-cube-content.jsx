import React from "react"
import petScan from "./assets/modality-cubes/pet-scan.jpg"
import nih from "./assets/modality-cubes/nih_cube.jpg"
import eeg from "./assets/modality-cubes/eeg.jpg"
import ieeg from "./assets/modality-cubes/ieeg.jpg"
import mri from "./assets/modality-cubes/mri.jpg"
import meg from "./assets/modality-cubes/meg.jpg"
import nirs from "./assets/modality-cubes/nirs.jpg"
import nih_logo from "./assets/portal-content/nih-bi-brand.png"

export const cubeData = [
  {
    label: "MRI",
    cubeImage: mri,
    stats: (
      <>
        200 Datasets
        <br />
        200 Participants
      </>
    ),
  },
  {
    label: "PET",
    cubeImage: petScan,
    stats: (
      <>
        200 Datasets
        <br />
        200 Participants
      </>
    ),
  },
  {
    label: "MEG",
    cubeImage: meg,
    stats: (
      <>
        200 Datasets
        <br />
        200 Participants
      </>
    ),
  },
  {
    label: "EEG",
    cubeImage: eeg,
    stats: (
      <>
        200 Datasets
        <br />
        200 Participants
      </>
    ),
  },
  {
    label: "iEEG",
    cubeImage: ieeg,
    stats: (
      <>
        200 Datasets
        <br />
        200 Participants
      </>
    ),
  },
  {
    label: "NIRS",
    cubeImage: nirs,
    stats: (
      <>
        200 Datasets
        <br />
        200 Participants
      </>
    ),
  },
  {
    label: "NIH",
    altText: "NIH BRAIN Initiative",
    portal: true,
    cubeImage: nih,
    cubeFaceImage: nih_logo,
    stats: (
      <>
        200 Datasets
        <br />
        200 Participants
      </>
    ),
  },
]
