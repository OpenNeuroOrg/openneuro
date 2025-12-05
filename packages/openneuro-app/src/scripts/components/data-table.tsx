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

export function extractDateString(dateString: string): Date | false {
  const formats = [
    "yyyy-MM-dd",
    "yyyy-MM-ddTHH:mm:ss",
    "MM/dd/yyyy",
    "dd/MM/yyyy",
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
function CellFormat(props: any): React.ReactElement | string | number | null {
  const value = props.getValue()

  // Ensure value is not null, undefined, or an empty string before processing.
  if (
    value === null || value === undefined ||
    (typeof value === "string" && value.length === 0)
  ) {
    return ""
  }

  // If array, filter out null/undefined elements before joining
  if (Array.isArray(value)) {
    return value.filter((item) => item !== null && item !== undefined).join(
      ", ",
    )
  }

  let extractedDate: Date | false = false
  if (typeof value === "string") {
    extractedDate = extractDateString(value)
  }

  if (extractedDate instanceof Date) {
    return format(extractedDate, "yyyy-MM-dd")
  } else if (typeof value === "string" && /^ds[0-9]{6}$/.exec(value)) {
    return <a href={`/datasets/${value}`}>{value}</a>
  } else {
    return value
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const safeStringSort = (a: any, b: any): number => {
  // Coerce to string safely, handle null/undefined by converting to empty string
  const aStr = String(a ?? "").toLowerCase()
  const bStr = String(b ?? "").toLowerCase()
  return aStr > bStr ? 1 : aStr < bStr ? -1 : 0
}

/**
 * Take a general table-like array of objects (one object per row) and render as a simple table with sortable columns
 */
export function DataTable<T extends Record<string, unknown>>({
  data,
  hideColumns = [],
}: DataTableProps): React.ReactElement {
  // 🛠️ FIX: Move all Hooks to the top, before the conditional return
  const [sorting, setSorting] = React.useState<SortingState>([])
  const columnHelper = createColumnHelper<T>()

  const memoData = React.useMemo(() => data as T[], [data])

  const columns = React.useMemo(
    () =>
      // Conditionally generate columns only if data is valid enough to extract keys
      data && data.length > 0 && data[0]
        ? Object.keys(data[0] as T)
          .filter((name) => !hideColumns.includes(name))
          .map((name) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            columnHelper.accessor(name as any, {
              header: name,
              cell: CellFormat,
              sortingFn: (rowA, rowB, columnId) => {
                const a = rowA.getValue(columnId)
                const b = rowB.getValue(columnId)
                return safeStringSort(a, b)
              },
            })
          )
        : [],
    [data, hideColumns],
  )

  const table = useReactTable<T>({
    data: memoData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  })

  // The conditional return (empty data check)
  if (!data || data.length === 0 || !data[0]) {
    return (
      <div>
        No data available to display.<br />
        <>
          Please email issues or questions to{" "}
          <a href={"mailto:support@openneuro.freshdesk.com"}>
            support@openneuro.freshdesk.com
          </a>
          .
        </>
      </div>
    )
  }

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
