// dependencies -------------------------------------------------------

import React from 'react'
import { gql, useMutation } from '@apollo/client'
import Helmet from 'react-helmet'
import { pageTitle } from '../resources/strings'
import PropTypes from 'prop-types'
import { reexporterLogsURL } from '../resources/kibana'
import styled from '@emotion/styled'

const ButtonsContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  minWidth: '300px',
})

const NormalizedButton = styled.button({
  margin: 0,
  fontWeight: 400,
  fontSize: '14pt',
  textAlign: 'center',
  padding: '11px 13px',
  width: '100%',
})

const SuccessMessage = styled.p({
  color: 'rgb(92, 184, 92)',
})
const InProgressMessage = styled.p({
  color: 'orange',
})
const ErrorMessage = styled.p({
  color: 'red',
})

const DividerContainer = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
})
const HBar = styled.div({
  height: '2px',
  backgroundColor: 'lightgrey',
  flexGrow: 1,
})
const DividerText = styled.p({
  padding: '19px 1rem',
  margin: 0,
  fontWeight: 400,
  fontSize: '14pt',
  textAlign: 'center',
})

const Divider = ({ text }) => (
  <DividerContainer>
    <HBar />
    <DividerText>{text}</DividerText>
    <HBar />
  </DividerContainer>
)

Divider.propTypes = {
  text: PropTypes.string,
}

const REEXPORT_REMOTES = gql`
  mutation reexportRemotes {
    reexportRemotes
  }
`

const Exports = () => {
  const [reexportRemotes, { data, loading, error }] = useMutation(
    REEXPORT_REMOTES,
  )
  const success = data && data.reexportRemotes
  return (
    <>
      <Helmet>
        <title>Admin Dashboard - {pageTitle}</title>
      </Helmet>
      <div className="dashboard-dataset-teasers fade-in admin-users clearfix">
        <div className="header-wrap clearfix">
          <div className="col-sm-9">
            <h2>Exports</h2>
          </div>
        </div>

        <div className="col-xs-4">
          <ButtonsContainer>
            {loading && (
              <InProgressMessage>Your export is in progress.</InProgressMessage>
            )}
            {error && <ErrorMessage>An error has occurred.</ErrorMessage>}
            {success && (
              <SuccessMessage>Your export was successful.</SuccessMessage>
            )}
            <NormalizedButton
              className="btn-modal-action"
              onClick={() => reexportRemotes()}>
              Run Export
            </NormalizedButton>
            <Divider text="or" />
            <NormalizedButton
              className="btn-blue"
              onClick={() => {
                window.open(reexporterLogsURL, '_blank')
              }}>
              View Export Logs
            </NormalizedButton>
          </ButtonsContainer>
        </div>
      </div>
    </>
  )
}

Exports.propTypes = {}

export default Exports
