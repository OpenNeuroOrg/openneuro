import React from "react"
import petScan from "../assets/pet-scan.jpg"
import nih from "../assets/nih_cube.jpg"
import eeg from "../assets/eeg.jpg"
import ieeg from "../assets/ieeg.jpg"
import mri from "../assets/mri.jpg"
import meg from "../assets/meg.jpg"
import nirs from "../assets/nirs.jpg"
import nih_logo from "../assets/nih-bi-brand.png"

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
