const datasetType_available = [
  { label: 'All', value: 'All' },
  { label: 'Following', value: 'Following' },
  { label: 'My Uploads', value: 'My Uploads' },
  { label: 'My Bookmarks', value: 'My Bookmarks' },
]

const datasetStatus_available = [
  { label: 'Public', value: 'Public' },
  { label: 'Shared with Me', value: 'Shared with Me' },
  { label: 'Invalid', value: 'Invalid' },
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

export const gender_list = [
  { label: 'All', value: 'All' },
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
]

type OptionalNumberRange = [number | null, number | null]
type OptionalDateRange = [Date | null, Date | null]

interface SearchParams {
  keyword: string | null
  datasetType_available: typeof datasetType_available
  datasetType_selected: string | null
  datasetStatus_available: typeof datasetStatus_available
  datasetStatus_selected: string | null
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
  datasetType_available,
  datasetType_selected: null,
  datasetStatus_available,
  datasetStatus_selected: null,
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
  datasetType_available,
  datasetType_selected: 'All',
  datasetStatus_available,
  datasetStatus_selected: null,
  modality_available,
  modality_selected: null,
  ageRange: [null, null],
  subjectCountRange: [null, null],
  diagnosis_available: ["Alzheimer's", 'Another', 'Other'],
  diagnosis_selected: null,
  task_available: ['Rest', 'Another', 'Other'],
  task_selected: null,
  seniorAuthor_available: ['Author 1', 'Author 2'],
  seniorAuthor_selected: null,
  // more
  gender_available: ['All', 'Male', 'Female'],
  gender_selected: 'All',
  datePublicizedRange: [null, null],
  species_available: ['Human', 'Pig', 'Rat', 'Other'],
  species_selected: null,
  section_available: ['Cross', 'Longitudinal', 'Other'],
  section_selected: null,
  studyDomain_available: ['a', 'b', 'c'],
  studyDomain_selected: null,
}

export default TEMPORARY_initialSearchParams
