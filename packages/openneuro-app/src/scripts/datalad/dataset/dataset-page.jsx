import React from 'react'
import PropTypes from 'prop-types'
import LeftSidebar from './left-sidebar.jsx'
import DatasetMain from './dataset-main.jsx'
import DatasetTools from '../fragments/dataset-tools.jsx'

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
    return (
      <div className="page dataset">
        <div
          className={
            this.state.sidebar ? 'open dataset-container' : 'dataset-container'
          }>
          <LeftSidebar
            datasetId={this.props.dataset.id}
            snapshots={this.props.dataset.snapshots}
            draftModified={this.props.dataset.draft.modified}
          />
          <span className="show-nav-btn" onClick={this.toggleSidebar}>
            {this.state.sidebar ? (
              <i className="fa fa-angle-double-left" aria-hidden="true" />
            ) : (
              <i className="fa fa-angle-double-right" aria-hidden="true" />
            )}
          </span>
          <DatasetTools dataset={this.props.dataset} />
          <div className="fade-in inner-route dataset-route light">
            <div className="clearfix dataset-wrap">
              <div className="dataset-animation">
                <div className="col-xs-12 dataset-inner">
                  <DatasetMain dataset={this.props.dataset} />
                </div>
              </div>
            </div>
          </div>
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
  }),
}

export default DatasetPage
