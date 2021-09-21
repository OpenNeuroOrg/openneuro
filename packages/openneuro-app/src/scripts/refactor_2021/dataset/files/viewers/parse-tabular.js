const parseTabular = (data, separator) => {
  const rows = data.split('\n')
  // Remove any whitespace rows (usually trailing)
  const trimmedRows = rows.filter(row => !/^\s*$/.test(row))
  // remove header from rows
  const header = trimmedRows.shift().split(separator)

  return trimmedRows.map(row =>
    row
      .split(separator)
      .reduce(
        (rowObj, col, colIndex) => ((rowObj[header[colIndex]] = col), rowObj),
        {},
      ),
  )
}

export default parseTabular
