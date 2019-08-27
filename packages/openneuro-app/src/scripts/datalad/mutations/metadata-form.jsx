import React from 'react'
import { PropTypes } from 'prop-types'
import TextInput from '../fragments/text-input.jsx'
import SelectInput from '../fragments/select-input.jsx'
import NumberInput from '../fragments/number-input.jsx'
import TextArrayInput from '../fragments/text-array-input.jsx'
import styled from '@emotion/styled'

const Form = styled.form({
  minWidth: '40rem',
})
const DisabledNote = styled.div({
  display: 'flex',
  color: '#5cb85c',

  i: {
    marginRight: '0.5rem',
  },
})
const SubmitButton = styled.button({
  marginTop: '15px',
})

const userDependentInput = [
  'associatedPaperDOI:',
  'species',
  'studyLongitudinal',
  'studyDomain',
  'trialCount',
  'studyDesign',
  'openneuroPaperDOI',
  'dxStatus',
]

const metadataFields = [
  {
    key: 'associatedPaperDOI',
    label: 'DOI of paper associated with DS (from submit lab)',
    Component: TextInput,
    additionalProps: {},
  },
  {
    key: 'species',
    label: 'Species',
    Component: SelectInput,
    additionalProps: {
      options: [{ value: 'Human' }],
      showOptionOther: true,
    },
  },
  {
    key: 'studyLongitudinal',
    label: 'Study Type',
    Component: SelectInput,
    additionalProps: {
      options: [{ value: 'Longitudinal' }],
      showOptionOther: true,
    },
  },
  {
    key: 'studyDomain',
    label: 'Domain Studied',
    Component: TextInput,
    additionalProps: {},
  },
  {
    key: 'trialCount',
    label: 'Number of Trials (if applicable)',
    Component: NumberInput,
    additionalProps: {
      min: -1,
    },
  },
  {
    key: 'studyDesign',
    label: 'Study Design',
    Component: TextInput,
    additionalProps: {},
  },
  {
    key: 'openneuroPaperDOI',
    label: 'DOI of paper b/c DS on OpenNeuro',
    Component: TextInput,
    additionalProps: {},
  },
  {
    key: 'dxStatus',
    label: 'DX status(es)',
    Component: SelectInput,
    additionalProps: {
      options: [{ value: 'Healthy / Control' }],
      showOptionOther: true,
    },
  },
  {
    key: 'tasksCompleted',
    label: 'Tasks Completed',
    Component: TextInput,
    additionalProps: {},
  },
  {
    key: 'datasetId',
    label: 'Dataset ID',
    Component: TextInput,
    additionalProps: {
      disabled: true,
    },
  },
  {
    key: 'datasetUrl',
    label: 'Dataset URL',
    Component: TextInput,
    additionalProps: {
      disabled: true,
    },
  },
  {
    key: 'firstSnapshotCreatedAt',
    label: 'First Snapshot (Publish) Date',
    Component: TextInput,
    additionalProps: {
      disabled: true,
    },
  },
  {
    key: 'latestSnapshotCreatedAt',
    label: 'Most Recent Snapshot Date',
    Component: TextInput,
    additionalProps: {
      disabled: true,
    },
  },
  {
    key: 'adminUsers',
    label: 'Admin Users (email)',
    Component: TextArrayInput,
    additionalProps: {
      disabled: true,
    },
  },
  {
    key: 'subjectCount',
    label: 'Number of Subjects',
    Component: NumberInput,
    additionalProps: {
      disabled: true,
    },
  },
  {
    key: 'modalities',
    label: 'Avaliable Modalities',
    Component: TextArrayInput,
    additionalProps: {
      disabled: true,
    },
  },
  {
    key: 'datasetName',
    label: 'Dataset Name',
    Component: TextInput,
    additionalProps: {
      disabled: true,
    },
  },
  {
    key: 'seniorAuthor',
    label: 'Senior Author (Last, First)',
    Component: TextInput,
    additionalProps: {
      disabled: true,
    },
  },
  {
    key: 'dataProcessed',
    label: 'Has Processed Data',
    Component: TextInput,
    additionalProps: {
      disabled: true,
    },
  },
  {
    key: 'ages',
    label: 'Age Range (yy-YY)',
    Component: TextInput,
    additionalProps: {
      disabled: true,
    },
  },
]

const MetadataForm = ({ values, onChange, onSubmit, hideDisabled }) => (
  <Form className="col-xs-6" onSubmit={onSubmit}>
    <DisabledNote>
      <i className="fa fa-asterisk" />
      <p>
        Some data is pulled from the dataset for you and cannot be edited here.
      </p>
    </DisabledNote>
    {metadataFields
      .filter(
        field => (hideDisabled ? userDependentInput.includes(field.key) : true),
      )
      .map(({ key, label, Component, additionalProps }, i) => (
        <Component
          name={key}
          label={label}
          value={values[key]}
          onChange={onChange}
          {...additionalProps}
          key={i}
        />
      ))}
    <SubmitButton className="btn-blue" type="submit">
      Submit Metadata
    </SubmitButton>
  </Form>
)

MetadataForm.propTypes = {
  keyLabelMap: PropTypes.object,
  values: PropTypes.object,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  hideDisabled: PropTypes.bool,
}

export default MetadataForm
