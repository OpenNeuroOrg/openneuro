import React from 'react'
import PropTypes from 'prop-types'
import { InfiniteLoader, List, AutoSizer } from 'react-virtualized'
import DatasetRow from './dataset-row.jsx'
import styled from 'styled-components'

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
`

const DatasetVirtualScroller = ({ datasets, pageInfo, loadMoreRows }) => {
  datasetVirtualList = datasets
  return (
    <FlexParent>
      <FlexFullHeight>
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          rowCount={pageInfo.count}>
          {({ onRowsRendered, registerChild }) => (
            <AutoSizer>
              {({ width, height }) => (
                <List
                  height={height}
                  onRowsRendered={onRowsRendered}
                  ref={registerChild}
                  rowCount={pageInfo.count}
                  rowHeight={94}
                  rowRenderer={rowRenderer}
                  width={width}
                />
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
      </FlexFullHeight>
    </FlexParent>
  )
}

DatasetVirtualScroller.propTypes = {
  datasets: PropTypes.array,
  pageInfo: PropTypes.object,
  loadMoreRows: PropTypes.func,
}

export default DatasetVirtualScroller
