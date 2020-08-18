import React from 'react'
import { PropTypes } from 'prop-types'
import TextInput from '../fragments/text-input.jsx'
import SelectInput from '../fragments/select-input.jsx'
import styled from '@emotion/styled'

const Form = styled.form({
  minWidth: '40rem',
  margin: '10px 0',
})

const fields = hasEdit => {
  const fields = [
    {
      key: 'reason',
      label: 'Reason',
      Component: SelectInput,
      additionalProps: {
        options: [
          { value: 'subject privacy' },
          { value: 'duplicate dataset' },
          { value: 'abuse of service', admin: true },
        ],
        showOptionOther: true,
        required: false,
      },
    },
    {
      key: 'redirect',
      label: 'Superseded by (URL)',
      Component: TextInput,
      additionalProps: {
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

const DeleteDatasetForm = ({ values, onChange, hasEdit }) => (
  <Form id="metadata-form" className="col-xs-6">
    {fields(hasEdit).map(
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

DeleteDatasetForm.propTypes = {
  keyLabelMap: PropTypes.object,
  values: PropTypes.object,
  onChange: PropTypes.func,
  hideDisabled: PropTypes.bool,
  hasEdit: PropTypes.bool,
}

export default DeleteDatasetForm
