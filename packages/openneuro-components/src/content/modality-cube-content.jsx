import React from 'react'
import petScan from '../assets/pet-scan.jpg'
import eeg from '../assets/eeg.jpg'
import ieeg from '../assets/ieeg.jpg'
import mri from '../assets/mri.jpg'
import meg from '../assets/meg.jpg'

export const cubeData = [
  {
    label: 'MRI',
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
    label: 'PET',
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
    label: 'MEG',
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
    label: 'EEG',
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
    label: 'iEEG',
    cubeImage: ieeg,
    stats: (
      <>
        200 Datasets
        <br />
        200 Participants
      </>
    ),
  },
]
