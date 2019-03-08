import React from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'

const SidebarRow = ({ datasetId, id, version, draft = false, active }) => {
  const url = draft
    ? `/datasets/${datasetId}`
    : `/datasets/${datasetId}/versions/${version}`
  const activeClass = draft
    ? (active === 'draft' && 'active') || ''
    : (active === version && 'active') || ''
  return (
    <li key={id}>
      <Link to={url} className={activeClass}>
        <div className="clearfix">
          <div className=" col-xs-12">
            <span className="dataset-type">{version}</span>
            <span className="date-modified" />
            <span className="icons" />
          </div>
        </div>
      </Link>
    </li>
  )
}

SidebarRow.propTypes = {
  datasetId: PropTypes.string,
  id: PropTypes.string,
  version: PropTypes.string,
  draft: PropTypes.bool,
}

export const snapshotVersion = location => {
  const matches = location.pathname.match(/versions\/(.*?)(\/|$)/)
  return matches && matches[1]
}

const LeftSidebar = ({ datasetId, snapshots, location }) => {
  const active = snapshotVersion(location) || 'draft'
  return (
    <div className="left-sidebar">
      <span className="slide">
        <div role="presentation" className="snapshot-select">
          <span>
            <h3>Versions</h3>
            <ul>
              <SidebarRow
                key={'Draft'}
                id={datasetId}
                datasetId={datasetId}
                version={'Draft'}
                draft
                active={active}
              />
              {snapshots.map(snapshot => (
                <SidebarRow
                  key={snapshot.id}
                  id={snapshot.id}
                  datasetId={datasetId}
                  version={snapshot.tag}
                  modified={snapshot.created}
                  active={active}
                />
              ))}
            </ul>
          </span>
        </div>
      </span>
    </div>
  )
}

LeftSidebar.propTypes = {
  active: PropTypes.string,
  datasetId: PropTypes.string,
  snapshots: PropTypes.array,
}

export default withRouter(LeftSidebar)
