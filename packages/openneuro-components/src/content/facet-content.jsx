import React from "react"

export const modalities = [
  {
    label: "MRI",
    value: "MRI",
    count: null,
    children: [
      {
        label: "Functional",
        value: "Functional",
        count: null,
      },
      {
        label: "Structural",
        value: "Structural",
        count: null,
      },
      {
        label: "Diffusion",
        value: "Diffusion",
        count: null,
      },
      {
        label: "ASL Perfusion",
        value: "ASL Perfusion",
        count: null,
      },
    ],
  },
  {
    label: "PET",
    value: "PET",
    count: null,
    children: [
      {
        label: "Static",
        value: "Static",
        count: null,
      },
      {
        label: "Dynamic",
        value: "Dynamic",
        count: null,
      },
    ],
  },
  {
    label: "EEG",
    value: "EEG",
    count: null,
  },
  {
    label: "iEEG",
    value: "iEEG",
    count: null,
  },
  {
    label: "MEG",
    value: "MEG",
    count: null,
  },
]

export const datasetType_available = [
  { label: "All Public", value: "All Public" },
  { label: "Following", value: "Following" },
  { label: "My Datasets", value: "My Datasets" },
  { label: "My Bookmarks", value: "My Bookmarks" },
]

export const dataset_type = [
  { label: "Public", value: "Public" },
  { label: "Shared with Me", value: "Shared with Me" },
  { label: "Invalid", value: "Invalid" },
]

export const diagnosis_list = [
  {
    label: "Alzheimer's",
    value: "Alzheimer's",
  },
  {
    label: "Another",
    value: "Another",
  },
  {
    label: "Other",
    value: "Other",
  },
]

export const task_list = [
  {
    label: "Rest",
    value: "Rest",
  },
  {
    label: "Another",
    value: "Another",
  },
  {
    label: "Other",
    value: "Other",
  },
]

export const author_pi_list = [
  {
    label: "Author 1",
    value: "Author 1",
  },
  {
    label: "Author 2",
    value: "Author 2",
  },
  {
    label: "Author 3",
    value: "Author 3",
  },
]

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

export const species_list = [
  {
    label: "Human",
    value: "Human",
  },
  {
    label: "Rat",
    value: "Rat",
  },
  {
    label: "Mouse",
    value: "Mouse",
  },
  {
    label: "Other",
    value: "Other",
  },
]

export const section_list = [
  {
    label: "Cross",
    value: "Cross",
  },
  {
    label: "Longitudinal",
    value: "Longitudinal",
  },
  {
    label: "Other",
    value: "Other",
  },
]

export const domain_list = [
  {
    label: "Domain 1",
    value: "Domain 1",
  },
  {
    label: "Domain 2",
    value: "Domain 2",
  },
  {
    label: "Ontology",
    value: "Ontology",
  },
]
