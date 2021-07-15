import React from 'react'

export const modalities = [
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
        label: 'ASL Perfusion',
        value: 'ASL Perfusion',
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
    label: 'iEEG',
    value: 'iEEG',
    count: 303,
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

export const datasetType_available = [
  { label: 'All Public', value: 'All Public' },
  { label: 'Following', value: 'Following' },
  { label: 'My Datasets', value: 'My Datasets' },
  { label: 'My Bookmarks', value: 'My Bookmarks' },
]

export const dataset_type = [
  { label: 'Public', value: 'Public' },
  { label: 'Shared with Me', value: 'Shared with Me' },
  { label: 'Invalid', value: 'Invalid' },
]

export const diagnosis_list = [
  {
    label: "Alzheimer's",
    value: "Alzheimer's",
  },
  {
    label: 'Another',
    value: 'Another',
  },
  {
    label: 'Other',
    value: 'Other',
  },
]

export const task_list = [
  {
    label: 'Rest',
    value: 'Rest',
  },
  {
    label: 'Another',
    value: 'Another',
  },
  {
    label: 'Other',
    value: 'Other',
  },
]

export const author_pi_list = [
  {
    label: 'Author 1',
    value: 'Author 1',
  },
  {
    label: 'Author 2',
    value: 'Author 2',
  },
  {
    label: 'Author 3',
    value: 'Author 3',
  },
]

export const gender_list = [
  { label: 'All', value: 'All' },
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
]

export const date_list = [
  { label: 'All Time', value: 'All Time' },
  { label: 'Last 30 days', value: 'Last 30 days' },
  { label: 'Last 180 days', value: 'Last 180 days' },
  { label: 'Last 12 months', value: 'Last 12 months' },
]

export const species_list = [
  {
    label: 'Human',
    value: 'Human',
  },
  {
    label: 'Pig',
    value: 'Pig',
  },
  {
    label: 'Rat',
    value: 'Rat',
  },
  {
    label: 'Other',
    value: 'Other',
  },
]

export const section_list = [
  {
    label: 'Cross',
    value: 'Cross',
  },
  {
    label: 'Longitudinal',
    value: 'Longitudinal',
  },
  {
    label: 'Other',
    value: 'Other',
  },
]

export const domain_list = [
  {
    label: 'Domain 1',
    value: 'Domain 1',
  },
  {
    label: 'Domain 2',
    value: 'Domain 2',
  },
  {
    label: 'Ontology',
    value: 'Ontology',
  },
]
