import React from "react"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import type { SortingState } from "@tanstack/react-table"
import styled from "@emotion/styled"
import { format, isValid, parse } from "date-fns"

interface DataTableProps {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
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

const TD = styled.td`
  padding: 3px;
`

export function extractDateString(dateString) {
  const formats = [
    "yyyy-MM-dd", // ISO 8601
    "yyyy-MM-ddTHH:mm:ss", // ISO 8601 with time
    "MM/dd/yyyy", // US (M/D/YYYY)
    "dd/MM/yyyy", // European (D/M/YYYY)
  ]

  for (const format of formats) {
    try {
      const parsedDate = parse(dateString, format, new Date())
      if (isValid(parsedDate)) {
        return parsedDate
      }
    } catch (_err) {
      continue
    }
  }

  return false
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function CellFormat(props): any {
  const value = props.getValue()
  let extractedDate
  if (typeof value === "string") {
    extractedDate = extractDateString(value)
  }
  if (extractedDate instanceof Date) {
    return format(extractedDate, "yyyy-MM-dd")
  } else if (typeof value === "string" && /^ds[0-9]{6}$/.exec(value)) {
    return <a href={`/datasets/${value}`}>{value}</a>
  } else if (Array.isArray(value)) {
    return value.join(",")
  } else {
    return value
  }
}

/**
 * Take a general table-like array of objects (one object per row) and render as a simple table with sortable columns
 */
export function DataTable<T>({
  data = [],
  hideColumns = [],
}: DataTableProps): React.ReactElement {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const columnHelper = createColumnHelper<T>()

  const columns = React.useMemo(
    () => {
      if (!data || data.length === 0) {
        return [] // Safely return an empty array for columns
      }

      return Object.keys(data[0])
        .filter((name) => !hideColumns.includes(name))
        .map((name) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          columnHelper.accessor(name as any, {
            header: name,
            cell: CellFormat,
          })
        )
    },
    [data, columnHelper, hideColumns],
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
        {table.getHeaderGroups().map((headerGroup) => (
          <TR key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TH key={header.id} colSpan={header.colSpan}>
                {header.isPlaceholder ? null : (
                  <div
                    {...{
                      className: header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : "",
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    &nbsp;
                    {{
                      asc: "▲",
                      desc: "▼",
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                )}
              </TH>
            ))}
          </TR>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <TR key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TD key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TD>
            ))}
          </TR>
        ))}
      </tbody>
    </table>
  )
}
