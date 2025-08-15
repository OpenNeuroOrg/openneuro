import { sortBy } from "../common/content/sortby-list"

const datasetType_available = [
  { label: "All Public", value: "All Public" },
  { label: "Following", value: "Following" },
  { label: "My Datasets", value: "My Datasets" },
  { label: "My Bookmarks", value: "My Bookmarks" },
]

const datasetStatus_available = [
  { label: "All", value: "All" },
  { label: "Public", value: "Public" },
  { label: "Shared with Me", value: "Shared with Me" },
  { label: "Invalid", value: "Invalid" },
]

type ModalityOption = {
  label: string
  value: string
  portalPath: string
  count?: number
  children?: ModalityOption[]
}

export const modality_available: ModalityOption[] = [
  {
    label: "MRI",
    value: "mri",
    portalPath: "/search/modality/mri",
    count: null,
    // children: [
    //   {
    //     label: 'Functional',
    //     value: 'Functional',
    //     portalPath: '/search/modality/mri',
    //     count: null,
    //   },
    //   {
    //     label: 'Structural',
    //     value: 'Structural',
    //     portalPath: '/search/modality/mri',
    //     count: null,
    //   },
    //   {
    //     label: 'Diffusion',
    //     value: 'Diffusion',
    //     portalPath: '/search/modality/mri',
    //     count: null,
    //   },
    //   {
    //     label: 'ASL Perfusion',
    //     value: 'ASL Perfusion',
    //     portalPath: '/search/modality/mri',
    //     count: null,
    //   },
    // ],
  },
  {
    label: "PET",
    value: "pet",
    portalPath: "/search/modality/pet",
    count: null,
    // children: [
    //   {
    //     label: 'Static',
    //     value: 'Static',
    //     portalPath: '/search/modality/pet',
    //     count: null,
    //   },
    //   {
    //     label: 'Dynamic',
    //     value: 'Dynamic',
    //     portalPath: '/search/modality/pet',
    //     count: null,
    //   },
    // ],
  },
  {
    label: "EEG",
    value: "eeg",
    portalPath: "/search/modality/eeg",
    count: null,
  },
  {
    label: "iEEG",
    value: "ieeg",
    portalPath: "/search/modality/ieeg",
    count: null,
  },
  {
    label: "MEG",
    value: "meg",
    portalPath: "/search/modality/meg",
    count: null,
  },
  {
    label: "NIRS",
    value: "nirs",
    portalPath: "/search/modality/nirs",
    count: null,
  },
]

export const flattenedModalities = modality_available.reduce(
  (flattened: ModalityOption[], modality: ModalityOption): ModalityOption[] => {
    if (modality.children) {
      const { children } = modality
      const childlessModality = { ...modality }
      delete childlessModality.children
      return [...flattened, childlessModality, ...children]
    } else {
      return [...flattened, modality]
    }
  },
  [] as ModalityOption[],
)

export const sex_list = [
  { label: "All", value: "All" },
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
]

export const date_list = [
  { label: "All Time", value: "All Time" },
  { label: "Last 30 days", value: "Last 30 days" },
  { label: "Last 180 days", value: "Last 180 days" },
  { label: "Last 12 months", value: "Last 12 months" },
]

type OptionalNumberRange = [number | null, number | null]

export interface SearchParams {
  keywords: string[]
  searchAllDatasets: boolean
  datasetType_available: typeof datasetType_available
  datasetType_selected: string | null
  datasetStatus_available: typeof datasetStatus_available
  datasetStatus_selected: string | null
  modality_available: ModalityOption[]
  modality_selected: string | null
  ageRange: OptionalNumberRange
  subjectCountRange: OptionalNumberRange
  diagnosis_available: string[]
  diagnosis_selected: string | null
  tasks: string[]
  authors: string[]
  // more
  sex_available: string[]
  sex_selected: string | null
  date_available: string[]
  date_selected: string | null
  species_available: string[]
  species_selected: string | null
  section_available: string[]
  section_selected: string | null
  studyDomains: string[]
  bodyParts: string[]
  scannerManufacturers: string[]
  scannerManufacturersModelNames: string[]
  tracerNames: string[]
  tracerRadionuclides: string[]
  sortBy_available
  sortBy_selected
  bidsDatasetType_available: string[]
  bidsDatasetType_selected: string | null
  brain_initiative: string | null
}

const initialSearchParams: SearchParams = {
  keywords: [],
  searchAllDatasets: false,
  datasetType_available,
  datasetType_selected: "All Public",
  datasetStatus_available,
  datasetStatus_selected: "All",
  modality_available,
  modality_selected: null,
  ageRange: [null, null],
  subjectCountRange: [null, null],
  diagnosis_available: [
    "Healthy / Control",
    "Schizophrenia",
    "ADD/ADHD",
    "Alzheimers",
    "Other",
  ],
  diagnosis_selected: null,
  tasks: [],
  authors: [],
  // more
  sex_available: ["All", "Male", "Female"],
  sex_selected: "All",
  date_available: [
    "All Time",
    "Last 30 days",
    "Last 180 days",
    "Last 12 months",
  ],
  date_selected: "All Time",
  species_available: ["Human", "Rat", "Mouse", "Other"],
  species_selected: null,
  section_available: ["Cross-Sectional", "Longitudinal", "Other"],
  section_selected: null,
  studyDomains: [],
  bodyParts: [],
  scannerManufacturers: [],
  scannerManufacturersModelNames: [],
  tracerNames: [],
  tracerRadionuclides: [],
  sortBy_available: sortBy,
  sortBy_selected: sortBy[0],
  bidsDatasetType_available: ["raw", "derivative"],
  bidsDatasetType_selected: null,
  brain_initiative: null,
}

export default initialSearchParams
