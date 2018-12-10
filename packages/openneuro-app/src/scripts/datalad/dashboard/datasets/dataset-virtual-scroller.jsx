import React from 'react'
import PropTypes from 'prop-types'
import {
  InfiniteLoader,
  List,
  AutoSizer,
  WindowScroller,
} from 'react-virtualized'
import DatasetRow from './dataset-row.jsx'
import styled from '@emotion/styled'

let datasetVirtualList = []

const isRowLoaded = ({ index }) => !!datasetVirtualList[index]

const rowRenderer = ({ key, index, style }) => {
  if (index < datasetVirtualList.length) {
    return (
      <div key={key} style={style}>
        <DatasetRow dataset={datasetVirtualList[index].node} />
      </div>
    )
  } else {
    return (
      <div key={key} style={style}>
        Loading datasets...
      </div>
    )
  }
}

const FlexParent = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  flex: 1 1 auto;
`

const FlexFullHeight = styled.div`
  flex: 1 1 auto;
  white-space: nowrap;
`

class DatasetVirtualScroller extends React.Component {
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
      rowRenderer={rowRenderer}
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

  shouldComponentUpdate = () => false

  render() {
    datasetVirtualList = this.props.datasets
    return (
      <FlexParent>
        <FlexFullHeight>
          <InfiniteLoader
            isRowLoaded={isRowLoaded}
            loadMoreRows={this.props.loadMoreRows}
            rowCount={this.props.pageInfo.count}>
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
}

export default DatasetVirtualScroller
