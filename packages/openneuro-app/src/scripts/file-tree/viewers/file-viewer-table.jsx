import React from 'react'
import { Column, Table } from 'react-virtualized'
import PropTypes from 'prop-types'

const FileViewerTable = ({ tableData }) => (
  <Table
    width={300}
    height={300}
    headerHeight={20}
    rowHeight={30}
    rowCount={tableData.length}
    rowGetter={({ index }) => tableData[index]}>
    {Object.keys(tableData[0]).map((colName, index) => (
      <Column label={colName} dataKey={colName} key={index} />
    ))}
  </Table>
)

FileViewerTable.propTypes = {
  data: PropTypes.object,
}

export default FileViewerTable
