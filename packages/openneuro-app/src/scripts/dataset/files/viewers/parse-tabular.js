const parseTabular = (data, separator) => {
  const rows = data.split("\n")

  let trimmedRows = rows.filter((row) => !/^\s*$/.test(row))

  if (trimmedRows.length === 0) {
    return []
  }

  const header = trimmedRows.shift().split(separator)

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
