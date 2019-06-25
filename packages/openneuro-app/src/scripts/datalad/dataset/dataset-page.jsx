import React from 'react'
import PropTypes from 'prop-types'
import LeftSidebar from './left-sidebar.jsx'
import DatasetMain from './dataset-main.jsx'
import DatasetTools from '../fragments/dataset-tools.jsx'
import ErrorBoundary from '../../errors/errorBoundary.jsx'

class DatasetPage extends React.Component {
  constructor(props) {
    super(props)
    this.toggleSidebar = this.toggleSidebar.bind(this)
    this.state = {
      sidebar: true,
    }
  }

  toggleSidebar() {
    this.setState({ sidebar: !this.state.sidebar })
  }

  render() {
    const { dataset, error } = this.props
    return (
      <div className="page dataset">
        <div
          className={
            this.state.sidebar ? 'open dataset-container' : 'dataset-container'
          }>
          <ErrorBoundary error={error}>
            <LeftSidebar
              datasetId={dataset.id}
              snapshots={dataset.snapshots}
              draftModified={dataset.draft.modified}
            />
            <span className="show-nav-btn" onClick={this.toggleSidebar}>
              {this.state.sidebar ? (
                <i className="fa fa-angle-double-left" aria-hidden="true" />
              ) : (
                <i className="fa fa-angle-double-right" aria-hidden="true" />
              )}
            </span>
            <DatasetTools dataset={dataset} />
            <div className="fade-in inner-route dataset-route light">
              <div className="clearfix dataset-wrap">
                <div className="dataset-animation dataset-inner">
                  <DatasetMain dataset={dataset} />
                </div>
              </div>
            </div>
          </ErrorBoundary>
        </div>
      </div>
    )
  }
}

DatasetPage.propTypes = {
  dataset: PropTypes.shape({
    id: PropTypes.string,
    draft: PropTypes.object,
    snapshots: PropTypes.array,
    onBrainlife: PropTypes.bool,
  }),
}

export default DatasetPage
