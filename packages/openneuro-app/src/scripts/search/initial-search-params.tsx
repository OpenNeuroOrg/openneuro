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
    value: 'mri',
    count: 30,
    children: [
      {
        label: 'Functional',
        value: 'functional',
        count: 30,
      },
      {
        label: 'Structural',
        value: 'structural',
        count: 30,
      },
      {
        label: 'Diffusional',
        value: 'diffusional',
        count: 30,
      },
      {
        label: 'Perfusion',
        value: 'perfusion',
        count: 30,
      },
    ],
  },
  {
    label: 'ASL',
    value: 'asl',
    count: 30,
  },
  {
    label: 'EEG',
    value: 'eeg',
    count: 30,
  },
  {
    label: 'IEEG',
    value: 'ieeg',
    count: 30,
    children: [
      {
        label: 'ECoG',
        value: 'ecog',
        count: 34,
      },
      {
        label: 'SEEG',
        value: 'seeg',
        count: 34,
      },
    ],
  },
  {
    label: 'MEG',
    value: 'meg',
    count: 34,
  },
  {
    label: 'PET',
    value: 'pet',
    count: 30,
    children: [
      {
        label: 'Static',
        value: 'static',
        count: 34,
      },
      {
        label: 'Dynamic',
        value: 'dynamic',
        count: 34,
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
