import React from 'react'
import PropTypes from 'prop-types'
import TextInput from '../fragments/text-input'
import SelectInput from '../fragments/select-input'
import NumberInput from '../fragments/number-input'
import TextArrayInput from '../fragments/text-array-input'
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

const ValidationError = styled.div({
  display: 'flex',
  color: 'red',

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
      component: TextInput,
      additionalProps: {
        required: false,
      },
    },
    {
      key: 'species',
      label: 'Species',
      component: SelectInput,
      additionalProps: {
        options: [{ value: 'Human' }],
        showOptionOther: true,
        required: false,
      },
    },
    {
      key: 'studyLongitudinal',
      label: 'Study Type',
      component: SelectInput,
      additionalProps: {
        options: [{ value: 'Longitudinal' }, { value: 'Cross-Sectional' }],
        showOptionOther: true,
        required: false,
      },
    },
    {
      key: 'studyDomain',
      label: 'Domain Studied',
      component: TextInput,
      additionalProps: {
        required: false,
      },
    },
    {
      key: 'trialCount',
      label: 'Number of Trials (if applicable)',
      component: NumberInput,
      additionalProps: {
        min: -1,
        required: false,
      },
    },
    {
      key: 'studyDesign',
      label: 'Study Design',
      component: TextInput,
      additionalProps: {
        required: false,
      },
    },
    {
      key: 'openneuroPaperDOI',
      label: 'Papers published from this dataset',
      hoverText: 'Papers that were published from downloading this dataset',
      component: TextInput,
      additionalProps: {
        required: false,
      },
    },
    {
      key: 'dxStatus',
      label: 'DX status(es)',
      component: SelectInput,
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
      component: TextArrayInput,
      additionalProps: {
        disabled: true,
        annotated: true,
        required: false,
      },
    },
    {
      key: 'grantFunderName',
      label: 'Grant Funder Name',
      component: TextInput,
      additionalProps: {
        required: false,
      },
    },
    {
      key: 'grantIdentifier',
      label: 'Grant Identifier',
      component: TextInput,
      additionalProps: {
        required: false,
      },
    },
    {
      key: 'datasetId',
      label: 'Dataset ID',
      component: TextInput,
      additionalProps: {
        disabled: true,
        annotated: true,
        required: false,
      },
    },
    {
      key: 'datasetUrl',
      label: 'Dataset URL',
      component: TextInput,
      additionalProps: {
        disabled: true,
        annotated: true,
        required: false,
      },
    },
    {
      key: 'datasetName',
      label: 'Dataset Name',
      component: TextInput,
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
      component: TextInput,
      additionalProps: {
        disabled: true,
        annotated: true,
        required: false,
      },
    },
    {
      key: 'adminUsers',
      label: 'Admin Users (email)',
      component: TextArrayInput,
      additionalProps: {
        disabled: true,
        annotated: true,
        required: false,
      },
    },
    {
      key: 'firstSnapshotCreatedAt',
      label: 'First Snapshot (Publish) Date',
      component: TextInput,
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
      component: TextInput,
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
      component: TextInput,
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
      component: TextArrayInput,
      additionalProps: {
        disabled: true,
        annotated: true,
        required: false,
      },
    },
    {
      key: 'dataProcessed',
      label: 'Has Processed Data',
      component: TextInput,
      additionalProps: {
        disabled: true,
        annotated: true,
        required: false,
      },
    },
    {
      key: 'affirmedDefaced',
      label: 'Uploader Affirmed Structural Scans Are Defaced',
      component: SelectInput,
      additionalProps: {
        options: [
          {
            value: true,
            text: 'true',
          },
          {
            value: false,
            text: 'false',
          },
        ],
        hasBooleanValues: true,
        showOptionOther: false,
        disabled: false,
        annotated: false,
        required: false,
        warningOnChange:
          'Details: Affirms or refutes that all structural scans have been defaced, obscuring any tissue on or near the face that could potentially be used to reconstruct the facial structure.',
      },
    },
    {
      key: 'affirmedConsent',
      label: 'Uploader Affirmed Consent To Publish Scans Without Defacing',
      component: SelectInput,
      additionalProps: {
        options: [
          {
            value: true,
            text: 'true',
          },
          {
            value: false,
            text: 'false',
          },
        ],
        hasBooleanValues: true,
        showOptionOther: false,
        disabled: false,
        annotated: false,
        required: false,
        warningOnChange:
          'Details: Affirms or refutes that I have explicit participant consent and ethical authorization to publish structural scans without defacing',
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

const MetadataForm = ({
  values,
  onChange,
  hideDisabled,
  hiddenFields = [],
  hasEdit,
  validationErrors = [],
}) => (
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
        field =>
          !(hideDisabled && field.additionalProps.disabled) &&
          !hiddenFields.includes(field.key),
      )
      .map(
        (
          {
            key,
            label,
            hoverText,
            component: FieldComponent,
            additionalProps,
            transformValue,
          },
          i,
        ) => (
          // @ts-expect-error
          <FieldComponent
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
    {Boolean(validationErrors.length) &&
      validationErrors.map((errorMessage, i) => (
        <ValidationError key={i}>
          <i className="fa fa-asterisk" />
          <p>{errorMessage}</p>
        </ValidationError>
      ))}
  </Form>
)

MetadataForm.propTypes = {
  keyLabelMap: PropTypes.object,
  values: PropTypes.object,
  onChange: PropTypes.func,
  hideDisabled: PropTypes.bool,
  hiddenFields: PropTypes.array,
  hasEdit: PropTypes.bool,
  validationErrors: PropTypes.array,
}

export default MetadataForm
