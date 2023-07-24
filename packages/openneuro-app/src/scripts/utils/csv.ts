/**
 * Convert from array of objects to CSV
 * Filters out __typename columns as GraphQL responses will often include this but it is unwanted in CSV files saved
 */
export function convertArrayToCSV<T>(array: T[]): string {
  if (array.length === 0) {
    return ''
  }

  const keys = Object.keys(array[0]).filter(key => key !== '__typename')
  const headerRow = keys.join(',') + '\n'
  const dataRows = array.map(obj =>
    keys
      .map(key =>
        obj[key]
          ? `"${obj[key].toString().replace(/"/g, '""') as string}"`
          : '',
      )
      .join(','),
  )

  return headerRow + dataRows.join('\n')
}

/**
 * Generate and download a CSV file
 */
export function makeCsv<T>(rows: T[], filename: string): void {
  const csvContent = convertArrayToCSV(rows)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
