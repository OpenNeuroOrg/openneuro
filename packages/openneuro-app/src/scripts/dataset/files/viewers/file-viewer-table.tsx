import React from "react"
import { DataTable } from "../../../components/data-table"
import styled from "@emotion/styled"

const TableOverlow = styled.div`
  overflow-x: scroll;
  height: 64vh;
`

const FileViewerTable = ({ tableData }): React.ReactElement => {
  return (
    <TableOverlow>
      <DataTable data={tableData.rows}></DataTable>
    </TableOverlow>
  )
}

export default FileViewerTable
