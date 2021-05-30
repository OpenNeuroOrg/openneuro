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
    children: null,
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
    children: null,
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

export const showMyUploads_available = [
  { label: 'Public', value: 'public' },
  { label: 'Shared with Me', value: 'shared_with_me' },
  { label: 'Invalid', value: 'invalid' },
]

export const diagnosis = [
  {
    label: "Alzheimer's",
    value: 'alzheimers',
    children: null,
  },
  {
    label: 'Another',
    value: 'Another',
    children: null,
  },
  {
    label: 'Other',
    value: 'Other',
    children: null,
  },
]

export const task = [
  {
    label: 'Rest',
    value: 'rest',
    children: null,
  },
  {
    label: 'Another',
    value: 'Another',
    children: null,
  },
  {
    label: 'Other',
    value: 'Other',
    children: null,
  },
]

export const author_pi = [
  {
    label: 'Author 1',
    value: 'author-1',
    children: null,
  },
  {
    label: 'Author 2',
    value: 'author-2',
    children: null,
  },
  {
    label: 'Author 3',
    value: 'author-3',
    children: null,
  },
]

export const gender = [
  { label: 'All', value: 'all' },
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
]

export const species = [
  {
    label: 'Human',
    value: 'human',
    children: null,
  },
  {
    label: 'Pig',
    value: 'pig',
    children: null,
  },
  {
    label: 'Rat',
    value: 'rat',
    children: null,
  },
  {
    label: 'Other',
    value: 'other',
    children: null,
  },
]

export const section = [
  {
    label: 'Cross',
    value: 'cross',
    children: null,
  },
  {
    label: 'Longitudinal',
    value: 'longitudinal',
    children: null,
  },
  {
    label: 'Other',
    value: 'other',
    children: null,
  },
]

export const domain = [
  {
    label: 'Domain 1',
    value: '1',
    children: null,
  },
  {
    label: 'Domain 2',
    value: '2',
    children: null,
  },
  {
    label: 'Ontology',
    value: 'ontology',
    children: null,
  },
]
