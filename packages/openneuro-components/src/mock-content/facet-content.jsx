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
    label: 'iEEG',
    value: 'iEEG',
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

export const show_available = [
  { label: 'All', value: 'all' },
  { label: 'Following', value: 'following' },
  { label: 'My Uploads', value: 'my_uploads' },
  { label: 'My Bookmarks', value: 'bookmarked' },
]

export const dataset_type = [
  { label: 'Public', value: 'public' },
  { label: 'Shared with Me', value: 'shared_with_me' },
  { label: 'Invalid', value: 'invalid' },
]

export const diagnosis_list = [
  {
    label: "Alzheimer's",
    value: 'alzheimers',
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
    value: 'rest',
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
    value: 'author-1',
  },
  {
    label: 'Author 2',
    value: 'author-2',
  },
  {
    label: 'Author 3',
    value: 'author-3',
  },
]

export const gender_list = [
  { label: 'All', value: 'all' },
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
]

export const species_list = [
  {
    label: 'Human',
    value: 'human',
  },
  {
    label: 'Pig',
    value: 'pig',
  },
  {
    label: 'Rat',
    value: 'rat',
  },
  {
    label: 'Other',
    value: 'other',
  },
]

export const section_list = [
  {
    label: 'Cross',
    value: 'cross',
  },
  {
    label: 'Longitudinal',
    value: 'longitudinal',
  },
  {
    label: 'Other',
    value: 'other',
  },
]

export const domain_list = [
  {
    label: 'Domain 1',
    value: '1',
  },
  {
    label: 'Domain 2',
    value: '2',
  },
  {
    label: 'Ontology',
    value: 'ontology',
  },
]
