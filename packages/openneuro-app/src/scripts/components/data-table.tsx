import React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table'
import styled from '@emotion/styled'

interface DataTableProps {
  data: any[]
  downloadFilename?: string
  hideColumns?: string[]
}

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

/**
 * Take a general table-like array of objects (one object per row) and render as a simple table with sortable columns
 */
export function DataTable<T>({
  data,
  hideColumns = [],
}: DataTableProps): React.ReactElement {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const columnHelper = createColumnHelper<T>()
  const columns = React.useMemo(
    () =>
      Object.keys(data[0])
        .filter(name => !hideColumns.includes(name))
        .map(name => columnHelper.accessor(name as any, { header: name })),
    [data, columnHelper],
  )
  const memoData = React.useMemo(() => data, [data])
  const table = useReactTable({
    data: memoData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  })
  return (
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
                    &nbsp;
                    {{
                      asc: '▲',
                      desc: '▼',
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
  )
}
