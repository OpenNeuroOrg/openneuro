import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { withRouter } from 'react-router'
import WarnButton from '../../common/forms/warn-button.jsx'

const HAS_METADATA = gql`
  query publicDatasetCount {
    datasets(filterBy: { public: true }) {
      pageInfo {
        count
      }
    }
  }
`

const MetadataTool = ({ datasetId, history }) => (
  <Query
    query={HAS_METADATA}
    errorPolicy="ignore"
  >
    {({ data }) => {
      const hasMetadata = data && data.hasMetadata
      return (
        <WarnButton
          tooltip={hasMetadata ? 'Metadata' : 'Add Metadata'}
          icon={hasMetadata ? 'fa-file-code-o' : 'fa-file-code-o icon-plus'}
          warn={false}
          action={() => {
            history.push({
              pathname: hasMetadata
                ? `/datasets/${datasetId}/metadata`
                : `/datasets/${datasetId}/metadata/edit`
            })
          }}
        />
      )
    }}
  </Query>
)

MetadataTool.propTypes = {
  datasetId: PropTypes.string,
  following: PropTypes.bool,
}

export default withRouter(MetadataTool)
