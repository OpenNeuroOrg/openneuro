import ljaf from '../../assets/ljaf.png'
import nsf from '../../assets/nsf.png'
import nih from '../../assets/nih.png'
import squishymedia from '../../assets/squishymedia.png'
import stanford from '../../assets/stanford.png'
import logo_app from '../../assets/logo_app.png'
import logo_cube from '../../assets/logo_cube.png'
import logo_data from '../../assets/logo_data.png'
import logo_users from '../../assets/logo_users.png'
import brand_mark from '../../assets/brand_mark.png'

export const frontPage = {
  pageTitle: 'OpenNeuro',
  copyright: {
    holder: 'Stanford Center for Reproducible Neuroscience',
  },
  pageDescription:
    'A free and open platform for sharing MRI, MEG, EEG, iEEG, ECoG, ASL, and PET data',
  titlePanel: {
    logos: [
      {
        class: 'logo-layer-users',
        src: logo_users,
        alt: 'OpenNeuro Logo',
      },
      {
        class: 'logo-layer-cube',
        src: logo_cube,
        alt: 'OpenNeuro Logo',
      },
      {
        class: 'logo-layer-app',
        src: logo_app,
        alt: 'OpenNeuro Logo',
      },
      {
        class: 'logo-layer-data',
        src: logo_data,
        alt: 'OpenNeuro Logo',
      },
    ],
    logoText: true,
    privacyDetail: '',
    privacyLink: 'https://www.stanford.edu/site/privacy/',
  },
  navBar: {
    brand: {
      src: brand_mark,
      alt: 'OpenNeuro Logo',
      title: 'OpenNeuro Link to Home Page',
      text: {
        first: 'Open',
        second: 'Neuro',
      },
    },
  },
  frontPageExtras: true,
  collaborators: true,
  support: [
    {
      title: 'Arnold Foundation',
      alt: 'Arnold Foundation',
      logo: ljaf,
      link: 'http://www.arnoldfoundation.org/',
      width: 4,
      offset: 0,
    },
    {
      title: 'NSF',
      alt: 'National Science Foundation',
      logo: nsf,
      link: 'https://www.nsf.gov/',
      width: 4,
      offset: 0,
    },
    {
      title: 'NIH',
      alt: 'National Institute on Drug and Abuse',
      logo: nih,
      link: 'https://nih.gov',
      width: 4,
      offset: 0,
    },
    {
      title: 'Stanford',
      alt: 'Stanford',
      logo: stanford,
      link: 'https://www.stanford.edu',
      width: 3,
      offset: 3,
    },
    {
      title: 'Squishymedia',
      alt: 'Squishymedia',
      logo: squishymedia,
      link: 'https://squishymedia.com',
      width: 3,
      offset: 0,
    },
  ],
}
