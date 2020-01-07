import React from 'react'
import PropTypes from 'prop-types'
import {
  InfiniteLoader,
  List,
  AutoSizer,
  WindowScroller,
} from 'react-virtualized'
import DatasetRow from './dataset-row.jsx'
import DatasetRowSkeleton from './dataset-row-skeleton.jsx'
import DatasetRowErrorBoundary from './dataset-row-error-boundary.jsx'
import styled from '@emotion/styled'

const FlexParent = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  flex: 1 1 auto;
`

const FlexFullHeight = styled.div`
  flex: 1 1 auto;
  white-space: nowrap;
  @media (max-width: 765px) {
    width: 100%;
  }
`

class DatasetVirtualScroller extends React.Component {
  _isRowLoaded = ({ index }) => {
    return index < this.props.datasets.length
  }

  _rowRender = ({ key, index, style }) => {
    if (this._isRowLoaded({ index })) {
      return (
        <div key={key} style={style}>
          <DatasetRowErrorBoundary
            datasetId={this.props.datasets[index].node.id}>
            <DatasetRow
              dataset={this.props.datasets[index].node}
              publicDashboard={this.props.publicDashboard}
            />
          </DatasetRowErrorBoundary>
        </div>
      )
    } else {
      return (
        <div key={key} style={style}>
          <DatasetRowSkeleton />
        </div>
      )
    }
  }

  _autosizeRender = (onRowsRendered, registerChild, height, scrollTop) => ({
    width,
  }) => (
    <List
      className="fade-in"
      autoHeight
      height={height}
      onRowsRendered={onRowsRendered}
      ref={registerChild}
      rowCount={this.props.pageInfo.count}
      rowHeight={94}
      rowRenderer={this._rowRender}
      width={width}
      scrollTop={scrollTop}
    />
  )

  _windowScrollerRender = (onRowsRendered, registerChild) => ({
    height,
    scrollTop,
  }) => (
    <AutoSizer disableHeight>
      {this._autosizeRender(onRowsRendered, registerChild, height, scrollTop)}
    </AutoSizer>
  )

  _loaderRender = ({ onRowsRendered, registerChild }) => (
    <WindowScroller>
      {this._windowScrollerRender(onRowsRendered, registerChild)}
    </WindowScroller>
  )

  shouldComponentUpdate(nextProps) {
    if (this.props.datasets.length !== nextProps.datasets.length) {
      return true
    }
    if (
      this.props.datasets[0].id !== nextProps.datasets[0].id ||
      this.props.datasets.slice(-1)[0].id !== nextProps.datasets.slice(-1)[0].id
    ) {
      return true
    }
    return false
  }

  render() {
    return (
      <FlexParent>
        <FlexFullHeight>
          <InfiniteLoader
            isRowLoaded={this._isRowLoaded}
            loadMoreRows={this.props.loadMoreRows}
            rowCount={this.props.pageInfo.count}
            minimumBatchSize={25}
            threshold={7}>
            {this._loaderRender}
          </InfiniteLoader>
        </FlexFullHeight>
      </FlexParent>
    )
  }
}

DatasetVirtualScroller.propTypes = {
  datasets: PropTypes.array,
  pageInfo: PropTypes.object,
  loadMoreRows: PropTypes.func,
  publicDashboard: PropTypes.bool,
}

export default DatasetVirtualScroller
