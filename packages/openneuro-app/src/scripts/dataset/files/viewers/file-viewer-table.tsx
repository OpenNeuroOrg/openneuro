import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table'

const TableOverlow = styled.div`
  overflow-x: scroll;
  height: 64vh;
`

const TH = styled.th`
  border-bottom: 1px solid #ccc;
  margin-right: 2em;
  div {
    display: inline-block;
  }
`

const TR = styled.tr`
  margin-right: 1em;
  margin-bottom: 0.8em;
`

const FileViewerTable = ({ tableData }): React.ReactElement => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const columnHelper = createColumnHelper()
  const columns = React.useMemo(
    () =>
      Object.keys(tableData[0]).map(name =>
        columnHelper.accessor(name, { header: name }),
      ),
    [tableData, columnHelper],
  )
  const data = React.useMemo(() => tableData, [tableData])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  })
  return (
    <TableOverlow>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <TR key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TH key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : '',
                        onClick: header.column.getToggleSortingHandler(),
                      }}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {{
                        asc: '🔼',
                        desc: '🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </TH>
              ))}
            </TR>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <TR key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </TR>
          ))}
        </tbody>
      </table>
    </TableOverlow>
  )
}

FileViewerTable.propTypes = {
  tableData: PropTypes.array,
}

export default FileViewerTable
