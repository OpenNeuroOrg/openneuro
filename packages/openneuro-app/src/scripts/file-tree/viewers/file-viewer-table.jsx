import React from 'react'
import { AutoSizer, Column, Table } from 'react-virtualized'
import PropTypes from 'prop-types'

const FileViewerTable = ({ tableData }) => (
  <AutoSizer disableHeight>
    {({ width }) => (
      <Table
        width={width}
        height={800}
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
)

FileViewerTable.propTypes = {
  data: PropTypes.object,
}

export default FileViewerTable
