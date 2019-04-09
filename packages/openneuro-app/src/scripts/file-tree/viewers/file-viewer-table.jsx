import React from 'react'
import { AutoSizer, Column, Table } from 'react-virtualized'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

const HalfViewport = styled.div`
  height: 50vh;
`

const FileViewerTable = ({ tableData }) => (
  <HalfViewport>
    <AutoSizer>
      {({ width, height }) => (
        <Table
          width={width}
          height={height}
          headerHeight={20}
          rowHeight={30}
          rowCount={tableData.length}
          rowGetter={({ index }) => tableData[index]}>
          {Object.keys(tableData[0]).map((colName, index) => (
            <Column label={colName} dataKey={colName} key={index} width={100} />
          ))}
        </Table>
      )}
    </AutoSizer>
  </HalfViewport>
)

FileViewerTable.propTypes = {
  tableData: PropTypes.object,
}

export default FileViewerTable
