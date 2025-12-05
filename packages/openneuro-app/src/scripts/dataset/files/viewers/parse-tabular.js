const parseTabular = (data, separator) => {
  // If data is null, undefined, or an empty string, return a safe empty array structure.
  if (!data) {
    return { headers: [], rows: [] }
  }

  const rows = data.split("\n")
  // Remove any whitespace rows (usually trailing)
  const trimmedRows = rows.filter((row) => !/^\s*$/.test(row))

  if (trimmedRows.length === 0) {
    return { headers: [], rows: [] }
  }

  // remove header from rows
  const header = trimmedRows.shift().split(separator)

  // Return the processed rows
  return trimmedRows.map((row) =>
    row
      .split(separator)
      .reduce(
        (rowObj, col, colIndex) => ((rowObj[header[colIndex]] = col), rowObj),
        {},
      )
  )
}

export default parseTabular
