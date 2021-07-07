import React from 'react'

import mriScan from '../assets/mri-scan.jpg'

export const portalContent = {
  mri: {
    modality: 'MRI', // corresponds to values in `modality_available` in (packages/openneuro-app/src/scripts/refactor_2021/search/initial-search-params.tsx)
    className: 'search-page-mri',
    portalName: 'OpenNeuro MRI',
    portalPrimary: (
      <>
        The OpenNeuro platform was developed by the Center for Reproducible Neuroscience as a tool to encourage and enhance data sharing and analysis of raw MRI data, using{' '}
        <a href="https://bids.neuroimaging.io">BIDS</a> to organize and standardize these data.
      </>
    ),
    publicDatasetStat: 100,
    participantsStat: 1100,
    hexBackgroundImage: mriScan,
    swoopBackgroundColorLight: 'rgba(109,83,156,1)',
    swoopBackgroundColorDark: 'rgba(45,34,64,1)',
    communityHeader:
      'Join the OHBM virtual meeting the week of June 21st, 2021',
    communityPrimary:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deser unt mollit anim id est laborumror sit voluptatem accusantium doloremque.',
    communitySecondary: (
      <span>
        Visit the <a href="#">Eventbright</a> for more information.
      </span>
    ),
  },
  eeg: {
    modality: 'EEG', // corresponds to values in `modality_available` in (packages/openneuro-app/src/scripts/refactor_2021/search/initial-search-params.tsx)
    className: 'search-page-eeg',
    portalName: 'OpenNeuro EEG',
    portalPrimary: (
      <>
        OpenNeuro added support for EEG datasets in 2019, when{' '}
        <a href="https://www.nature.com/articles/s41597-019-0104-8">EEG was incorporated</a> into the{' '}
        <a href="https://bids.neuroimaging.io">BIDS</a> standard.
      </>
    ),
    publicDatasetStat: 100,
    participantsStat: 1100,
    hexBackgroundImage: mriScan,
    swoopBackgroundColorLight: 'rgba(109,83,156,1)',
    swoopBackgroundColorDark: 'rgba(45,34,64,1)',
    communityHeader: 'Join the EEG hackathon on July 1st, 2021',
    communityPrimary:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deser unt mollit anim id est laborumror sit voluptatem accusantium doloremque.',
    communitySecondary: (
      <span>
        Visit the <a href="#">Eventbright</a> for more information.
      </span>
    ),
  },
  ieeg: {
    modality: 'iEEG', // corresponds to values in `modality_available` in (packages/openneuro-app/src/scripts/refactor_2021/search/initial-search-params.tsx)
    className: 'search-page-ieeg',
    portalName: 'OpenNeuro iEEG',
    portalPrimary: (
      <>
        OpenNeuro added support for iEEG datasets in 2019, when{' '}
        <a href="https://www.nature.com/articles/s41597-019-0105-7">iEEG was incorporated</a> into the{' '}
        <a href="https://bids.neuroimaging.io">BIDS</a> standard.
      </>
    ),
    publicDatasetStat: 100,
    participantsStat: 1100,
    hexBackgroundImage: mriScan,
    swoopBackgroundColorLight: 'rgba(109,83,156,1)',
    swoopBackgroundColorDark: 'rgba(45,34,64,1)',
    communityHeader: 'Join the iEEG hackathon on July 1st, 2021',
    communityPrimary:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deser unt mollit anim id est laborumror sit voluptatem accusantium doloremque.',
    communitySecondary: (
      <span>
        Visit the <a href="#">Eventbright</a> for more information.
      </span>
    ),
  },
  meg: {
    modality: 'MEG', // corresponds to values in `modality_available` in (packages/openneuro-app/src/scripts/refactor_2021/search/initial-search-params.tsx)
    className: 'search-page-meg',
    portalName: 'OpenNeuro MEG',
    portalPrimary: (
      <>
        OpenNeuro added support for MEG datasets in 2018, when{' '}
        <a href="https://www.nature.com/articles/sdata2018110">MEG was incorporated</a> into the{' '}
        <a href="https://bids.neuroimaging.io">BIDS</a> standard.
      </>
    ),
    publicDatasetStat: 100,
    participantsStat: 1100,
    hexBackgroundImage: mriScan,
    swoopBackgroundColorLight: 'rgba(109,83,156,1)',
    swoopBackgroundColorDark: 'rgba(45,34,64,1)',
    communityHeader: 'Join the MEG hackathon on July 1st, 2021',
    communityPrimary:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deser unt mollit anim id est laborumror sit voluptatem accusantium doloremque.',
    communitySecondary: (
      <span>
        Visit the <a href="#">Eventbright</a> for more information.
      </span>
    ),
  },
  pet: {
    modality: 'PET', // corresponds to values in `modality_available` in (packages/openneuro-app/src/scripts/refactor_2021/search/initial-search-params.tsx)
    className: 'search-page-pet',
    portalName: 'OpenNeuro PET',
    portalPrimary:
      'The OpenNeuro platform was developed by the Center for Reproducible Neuroscience as a tool to encourage and enhance data sharing and analysis of raw MRI data, using BIDS to organize and standardize this data. Since its release in 2017, the site has seen the upload of more than 200 public MRI-specific datasets.',
    publicDatasetStat: 100,
    participantsStat: 1100,
    hexBackgroundImage: mriScan,
    swoopBackgroundColorLight: 'rgba(109,83,156,1)',
    swoopBackgroundColorDark: 'rgba(45,34,64,1)',
    communityHeader: 'Join the PET hackathon on July 1st, 2021',
    communityPrimary:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deser unt mollit anim id est laborumror sit voluptatem accusantium doloremque.',
    communitySecondary: (
      <span>
        Visit the <a href="#">Eventbright</a> for more information.
      </span>
    ),
  },
}
