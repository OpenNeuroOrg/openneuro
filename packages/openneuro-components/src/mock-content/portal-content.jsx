import React from 'react'

import pet from '../assets/pet-scan.jpg'
import eeg from '../assets/eeg.jpg'
import ieeg from '../assets/ieeg.jpg'
import mri from '../assets/mri.jpg'
import meg from '../assets/meg.jpg'

export const portalContent = {
  mri: {
    modality: 'MRI', // corresponds to values in `modality_available` in (packages/openneuro-app/src/scripts/refactor_2021/search/initial-search-params.tsx)
    className: 'search-page-mri',
    portalName: 'OpenNeuro MRI',
    portalPrimary: (
      <>
        The OpenNeuro platform was developed by the{' '}
        <a href="https://reproducibility.stanford.edu/">
          Center for Reproducible Neuroscience
        </a>{' '}
        as a tool to encourage and enhance data sharing and analysis of raw MRI
        data, using <a href="https://bids.neuroimaging.io">BIDS</a> to organize
        and standardize these data.
      </>
    ),
    publicDatasetStat: 100,
    participantsStat: 1100,
    hexBackgroundImage: mri,
    swoopBackgroundColorLight: 'rgba(109,83,156,1)',
    swoopBackgroundColorDark: 'rgba(45,34,64,1)',
    communityHeader: null,
    communityPrimary: null,
    communitySecondary: null,
  },
  eeg: {
    modality: 'EEG', // corresponds to values in `modality_available` in (packages/openneuro-app/src/scripts/refactor_2021/search/initial-search-params.tsx)
    className: 'search-page-eeg',
    portalName: 'OpenNeuro EEG',
    portalPrimary: (
      <>
        OpenNeuro added support for EEG datasets in 2019, when{' '}
        <a href="https://www.nature.com/articles/s41597-019-0104-8">
          EEG was incorporated
        </a>{' '}
        into the <a href="https://bids.neuroimaging.io">BIDS</a> standard.
      </>
    ),
    publicDatasetStat: 100,
    participantsStat: 1100,
    hexBackgroundImage: eeg,
    swoopBackgroundColorLight: 'rgba(109,83,156,1)',
    swoopBackgroundColorDark: 'rgba(45,34,64,1)',
    communityHeader: null,
    communityPrimary: null,
    communitySecondary: null,
  },
  ieeg: {
    modality: 'iEEG', // corresponds to values in `modality_available` in (packages/openneuro-app/src/scripts/refactor_2021/search/initial-search-params.tsx)
    className: 'search-page-ieeg',
    portalName: 'OpenNeuro iEEG',
    portalPrimary: (
      <>
        OpenNeuro added support for iEEG datasets in 2019, when{' '}
        <a href="https://www.nature.com/articles/s41597-019-0105-7">
          iEEG was incorporated
        </a>{' '}
        into the <a href="https://bids.neuroimaging.io">BIDS</a> standard.
      </>
    ),
    publicDatasetStat: 100,
    participantsStat: 1100,
    hexBackgroundImage: ieeg,
    swoopBackgroundColorLight: 'rgba(109,83,156,1)',
    swoopBackgroundColorDark: 'rgba(45,34,64,1)',
    communityHeader: null,
    communityPrimary: null,
    communitySecondary: null,
  },
  meg: {
    modality: 'MEG', // corresponds to values in `modality_available` in (packages/openneuro-app/src/scripts/refactor_2021/search/initial-search-params.tsx)
    className: 'search-page-meg',
    portalName: 'OpenNeuro MEG',
    portalPrimary: (
      <>
        OpenNeuro added support for MEG datasets in 2018, when{' '}
        <a href="https://www.nature.com/articles/sdata2018110">
          MEG was incorporated
        </a>{' '}
        into the <a href="https://bids.neuroimaging.io">BIDS</a> standard.
      </>
    ),
    publicDatasetStat: 100,
    participantsStat: 1100,
    hexBackgroundImage: meg,
    swoopBackgroundColorLight: 'rgba(109,83,156,1)',
    swoopBackgroundColorDark: 'rgba(45,34,64,1)',
    communityHeader: null,
    communityPrimary: null,
    communitySecondary: null,
  },
  pet: {
    modality: 'PET', // corresponds to values in `modality_available` in (packages/openneuro-app/src/scripts/refactor_2021/search/initial-search-params.tsx)
    className: 'search-page-pet',
    portalName: 'OpenNeuro PET',
    portalPrimary: 'The PET portal of OpenNeuro is supported by a collaboration between Stanford University, NIH, MGH and the Neurobiology Research Unit (NRU) at Copenhagen University Hospital through the OpenNeuroPET project. The project is funded through the BRAIN Initiative and the Novo Nordisk Foundation. Besides developing data sharing, the OpenNeuroPET project also aims at developing user friendly tools for the BIDS based data curation of PET data as well as tools for automated QC and template building.',
    publicDatasetStat: 100,
    participantsStat: 1100,
    hexBackgroundImage: pet,
    swoopBackgroundColorLight: 'rgba(109,83,156,1)',
    swoopBackgroundColorDark: 'rgba(45,34,64,1)',
    communityHeader: null,
    communityPrimary: null,
    communitySecondary: null,
  },
}
