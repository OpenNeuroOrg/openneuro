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
`

const FlexFullHeight = styled.div`
  flex: 1 1 auto;
`

const DatasetVirtualScroller = ({ datasets, pageInfo, loadMoreRows }) => {
  datasetVirtualList = datasets
  return (
    <FlexParent>
      <FlexFullHeight>
        <div>
          <InfiniteLoader
            isRowLoaded={isRowLoaded}
            loadMoreRows={loadMoreRows}
            rowCount={pageInfo.count}>
            {({ onRowsRendered, registerChild }) => (
              <AutoSizer>
                {() => (
                  <List
                    height={250}
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    rowCount={pageInfo.count}
                    rowHeight={92}
                    rowRenderer={rowRenderer}
                    width={1000}
                  />
                )}
              </AutoSizer>
            )}
          </InfiniteLoader>
        </div>
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
