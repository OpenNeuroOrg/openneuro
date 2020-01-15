import React from 'react'
import { PropTypes } from 'prop-types'
import TextInput from '../fragments/text-input.jsx'
import SelectInput from '../fragments/select-input.jsx'
import NumberInput from '../fragments/number-input.jsx'
import TextArrayInput from '../fragments/text-array-input.jsx'
import styled from '@emotion/styled'

const Form = styled.form({
  minWidth: '40rem',
  margin: '10px 0',
})
const InfoText = styled.p({
  fontWeight: 100,
  textAlign: 'left',
})
const DisabledNote = styled.div({
  display: 'flex',
  color: '#5cb85c',

  i: {
    marginRight: '0.5rem',
  },
})

const metadataFields = hasEdit => {
  const fields = [
    {
      key: 'associatedPaperDOI',
      label: 'DOI of papers from the source data lab',
      hoverText:
        'Papers that were published from the Lab that collected this dataset',
      Component: TextInput,
      additionalProps: {
        required: false,
      },
    },
    {
      key: 'species',
      label: 'Species',
      Component: SelectInput,
      additionalProps: {
        options: [{ value: 'Human' }],
        showOptionOther: true,
        required: false,
      },
    },
    {
      key: 'studyLongitudinal',
      label: 'Study Type',
      Component: SelectInput,
      additionalProps: {
        options: [{ value: 'Longitudinal' }, { value: 'Cross-Sectional' }],
        showOptionOther: true,
        required: false,
      },
    },
    {
      key: 'studyDomain',
      label: 'Domain Studied',
      Component: TextInput,
      additionalProps: {
        required: false,
      },
    },
    {
      key: 'trialCount',
      label: 'Number of Trials (if applicable)',
      Component: NumberInput,
      additionalProps: {
        min: -1,
        required: false,
      },
    },
    {
      key: 'studyDesign',
      label: 'Study Design',
      Component: TextInput,
      additionalProps: {
        required: false,
      },
    },
    {
      key: 'openneuroPaperDOI',
      label: 'Papers published from this dataset',
      hoverText: 'Papers that were published from downloading this dataset',
      Component: TextInput,
      additionalProps: {
        required: false,
      },
    },
    {
      key: 'dxStatus',
      label: 'DX status(es)',
      Component: SelectInput,
      additionalProps: {
        options: [
          { value: 'Healthy / Control' },
          { value: 'Schizophrenia' },
          { value: 'ADD/ADHD' },
          { value: 'Alzheimers' },
        ],
        showOptionOther: true,
        required: false,
      },
    },
    {
      key: 'tasksCompleted',
      label: 'Tasks Completed',
      Component: TextInput,
      additionalProps: {
        required: false,
      },
    },
    {
      key: 'grantFunderName',
      label: 'Grant Funder Name',
      Component: TextInput,
      additionalProps: {
        required: false,
      },
    },
    {
      key: 'grantIdentifier',
      label: 'Grant Identifier',
      Component: TextInput,
      additionalProps: {
        required: false,
      },
    },
    {
      key: 'datasetId',
      label: 'Dataset ID',
      Component: TextInput,
      additionalProps: {
        disabled: true,
        annotated: true,
        required: false,
      },
    },
    {
      key: 'datasetUrl',
      label: 'Dataset URL',
      Component: TextInput,
      additionalProps: {
        disabled: true,
        annotated: true,
        required: false,
      },
    },
    {
      key: 'datasetName',
      label: 'Dataset Name',
      Component: TextInput,
      additionalProps: {
        disabled: true,
        annotated: true,
        required: false,
      },
    },
    {
      key: 'seniorAuthor',
      label: 'Senior Author (Last, First)',
      hoverText:
        'Please list the senior author as the last author in the dataset_description.json file field Authors',
      Component: TextInput,
      additionalProps: {
        disabled: true,
        annotated: true,
        required: false,
      },
    },
    {
      key: 'adminUsers',
      label: 'Admin Users (email)',
      Component: TextArrayInput,
      additionalProps: {
        disabled: true,
        annotated: true,
        required: false,
      },
    },
    {
      key: 'firstSnapshotCreatedAt',
      label: 'First Snapshot (Publish) Date',
      Component: TextInput,
      additionalProps: {
        disabled: true,
        annotated: true,
        nullMessage: 'dataset has no snapshots',
        required: false,
      },
    },
    {
      key: 'latestSnapshotCreatedAt',
      label: 'Most Recent Snapshot Date',
      Component: TextInput,
      additionalProps: {
        disabled: true,
        annotated: true,
        nullMessage: 'dataset has no snapshots',
        required: false,
      },
    },
    {
      key: 'ages',
      label: 'Subject Age(s)',
      // text input because field is read-only
      Component: TextInput,
      additionalProps: {
        disabled: true,
        annotated: true,
        required: false,
      },
      transformValue: value => {
        if (Array.isArray(value)) {
          const ages = value.filter(x => x)
          if (ages.length === 0) return 'N/A'
          else if (ages.length === 1) return ages[0]
          else return `${Math.min(...ages)} - ${Math.max(...ages)}`
        } else if (value === undefined) return 'N/A'
      },
    },
    {
      key: 'modalities',
      label: 'Modalities Available',
      Component: TextArrayInput,
      additionalProps: {
        disabled: true,
        annotated: true,
        required: false,
      },
    },
    {
      key: 'dataProcessed',
      label: 'Has Processed Data',
      Component: TextInput,
      additionalProps: {
        disabled: true,
        annotated: true,
        required: false,
      },
    },
  ]
  return hasEdit
    ? fields
    : fields.map(field => {
        field.additionalProps.disabled = true
        return field
      })
}

const MetadataForm = ({ values, onChange, hideDisabled, hasEdit }) => (
  <Form id="metadata-form" className="col-xs-6">
    <InfoText>
      Incomplete fields in this form will make it more difficult for users to
      search for your dataset.
      <br />
      We recommend completing the applicable fields to improve your search
      results.
    </InfoText>
    {!hideDisabled && (
      <DisabledNote>
        <i className="fa fa-asterisk" />
        <p>
          Some data is pulled from the dataset for you and cannot be edited
          here.
        </p>
      </DisabledNote>
    )}
    {metadataFields(hasEdit)
      .filter(
        // remove disabled fields when hideDisabled is true
        field => !(hideDisabled && field.additionalProps.disabled),
      )
      .map(
        (
          { key, label, hoverText, Component, additionalProps, transformValue },
          i,
        ) => (
          <Component
            name={key}
            label={label}
            hoverText={hoverText}
            value={transformValue ? transformValue(values[key]) : values[key]}
            onChange={onChange}
            {...additionalProps}
            key={i}
          />
        ),
      )}
  </Form>
)

MetadataForm.propTypes = {
  keyLabelMap: PropTypes.object,
  values: PropTypes.object,
  onChange: PropTypes.func,
  hideDisabled: PropTypes.bool,
  hasEdit: PropTypes.bool,
}

export default MetadataForm
