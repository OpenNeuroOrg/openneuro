const show_available = [
  { label: 'All', value: 'all' },
  { label: 'Following', value: 'following' },
  { label: 'My Uploads', value: 'my_uploads' },
  { label: 'My Bookmarks', value: 'bookmarked' },
]

const showMyUploads_available = [
  { label: 'Public', value: 'public' },
  { label: 'Shared with Me', value: 'shared_with_me' },
  { label: 'Invalid', value: 'invalid' },
]

const modality_available = [
  {
    label: 'MRI',
    value: 'MRI',
    count: 3000,
    children: [
      {
        label: 'Functional',
        value: 'Functional',
        count: 300,
      },
      {
        label: 'Structural',
        value: 'Structural',
        count: 200,
      },
      {
        label: 'Diffusion',
        value: 'Diffusion',
        count: 300,
      },
      {
        label: 'Perfusion',
        value: 'Perfusion',
        count: 150,
      },
    ],
  },
  {
    label: 'EEG',
    value: 'EEG',
    count: 303,
  },
  {
    label: 'IEEG',
    value: 'IEEG',
    count: 303,
    children: [
      {
        label: 'ECoG',
        value: 'ECoG',
        count: 300,
      },
      {
        label: 'SEEG',
        value: 'SEEG',
        count: 200,
      },
    ],
  },
  {
    label: 'MEG',
    value: 'MEG',
    count: 330,
  },
  {
    label: 'PET',
    value: 'PET',
    count: 30,
    children: [
      {
        label: 'Static',
        value: 'Static',
        count: 300,
      },
      {
        label: 'Dynamic',
        value: 'Dynamic',
        count: 200,
      },
    ],
  },
]

type OptionalNumberRange = [number | null, number | null]
type OptionalDateRange = [Date | null, Date | null]

interface SearchParams {
  keyword: string | null
  show_available: typeof show_available
  show_selected: string | null
  showMyUploads_available: typeof showMyUploads_available
  showMyUploads_selected: string | null
  modality_available: typeof modality_available
  modality_selected: string | null
  ageRange: OptionalNumberRange
  subjectCountRange: OptionalNumberRange
  diagnosis_available: string[]
  diagnosis_selected: string | null
  task_available: string[]
  task_selected: string | null
  seniorAuthor_available: string[]
  seniorAuthor_selected: string | null
  // more
  gender_available: string[]
  gender_selected: string | null
  datePublicizedRange: OptionalDateRange
  species_available: string[]
  species_selected: string | null
  section_available: string[]
  section_selected: string | null
  studyDomain_available: string[]
  studyDomain_selected: string | null
}

// TODO: move to this initial state
//       and load dynamic options on mount
const initialSearchParams: SearchParams = {
  keyword: null,
  show_available,
  show_selected: null,
  showMyUploads_available,
  showMyUploads_selected: null,
  modality_available,
  modality_selected: null,
  ageRange: [null, null],
  subjectCountRange: [null, null],
  diagnosis_available: [],
  diagnosis_selected: null,
  task_available: [],
  task_selected: null,
  seniorAuthor_available: [],
  seniorAuthor_selected: null,
  // more
  gender_available: [],
  gender_selected: null,
  datePublicizedRange: [null, null],
  species_available: [],
  species_selected: null,
  section_available: [],
  section_selected: null,
  studyDomain_available: [],
  studyDomain_selected: null,
}

// TODO: delete and move to dynamically loaded initialSearchParams
const TEMPORARY_initialSearchParams: SearchParams = {
  keyword: null,
  show_available,
  show_selected: null,
  showMyUploads_available,
  showMyUploads_selected: null,
  modality_available,
  modality_selected: null,
  ageRange: [null, null],
  subjectCountRange: [null, null],
  diagnosis_available: ['good', 'bad', 'ugly'],
  diagnosis_selected: null,
  task_available: ['bold', 'nback', 'xyz'],
  task_selected: null,
  seniorAuthor_available: ['Einstein', 'Dexter'],
  seniorAuthor_selected: null,
  // more
  gender_available: ['Male', 'Female', 'Other'],
  gender_selected: null,
  datePublicizedRange: [null, null],
  species_available: ['Human', 'Other'],
  species_selected: null,
  section_available: ['Transverse', 'Longitudinal'],
  section_selected: null,
  studyDomain_available: ['a', 'b', 'c'],
  studyDomain_selected: null,
}

export default TEMPORARY_initialSearchParams
