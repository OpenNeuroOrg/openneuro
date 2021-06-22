import React from 'react'

import mriScan from '../assets/mri-scan.jpg'

const portalContent = {
  mri: {
    modality: 'MRI', // corresponds to values in `modality_available` in (packages/openneuro-app/src/scripts/refactor_2021/search/initial-search-params.tsx)
    portalName: 'OpenNeuro MRI',
    portalPrimary:
      'The OpenNeuro platform was developed by the Center for Reproducible Neuroscience as a tool to encourage and enhance data sharing and analysis of raw MRI data, using BIDS to organize and standardize this data. Since its release in 2017, the site has seen the upload of more than 200 public MRI-specific datasets.',
    publicDatasetStat: 100,
    participantsStat: 1100,
    hexBackgroundImage: mriScan,
    swoopBackgroundColorLight: 'rgba(109,83,156,1)',
    swoopBackgroundColorDark: 'rgba(45,34,64,1)',
    communityHeader: 'Join the PET hackathon on July, 1st 2021',
    communityPrimary:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deser unt mollit anim id est laborumror sit voluptatem accusantium doloremque.',
    communitySecondary: (
      <span>
        Visit the{' '}
        <a href="#" target="_blank">
          Eventbright
        </a>{' '}
        for more information.
      </span>
    ),
  },
}

export default portalContent
