const schemaGenerator = datasets => {
  const dataset = datasets ? datasets.dataset : null
  const context = 'http://schema.org'
  const type = 'Dataset'
  let publisher = 'OpenNeuro'

  if (dataset) {
    let description = dataset.description
    let name = description ? description.Name : null
    let authors = formatAuthors(dataset.authors)
    let datePublished = dataset.created
    let dateModified = dataset.modified
    let license = description ? description.License : null
    let version = dataset.snapshot_version
    let datasetDescription = dataset.README ? dataset.README : dataset.label

    let schema = {
      '@context': context,
      '@type': type,
      // TODO: add @id field to doi reference uri when
      // added to each dataset
      // '@id': 'linktodoi',
      name: name,
      author: authors,
      datePublished: datePublished,
      dateModified: dateModified,
      license: license,
      publisher: publisher,
      description: datasetDescription,
      version: version,
    }
    return JSON.stringify(schema)
  } else {
    return null
  }
}

const formatAuthors = authorList => {
  if (authorList.length) {
    let authorsArray = []
    for (let author of authorList) {
      let nameParts = author.name ? author.name.split(' ') : []
      let familyName = nameParts.length ? nameParts[nameParts.length - 1] : null
      nameParts.pop()
      let givenName = nameParts.length ? nameParts.join(' ') : null
      let authorObj = {
        '@type': 'Person',
      }
      if (givenName) {
        authorObj.givenName = givenName
      }
      if (familyName) {
        authorObj.familyName = familyName
      }
      if (familyName || givenName) {
        authorsArray.push(authorObj)
      }
    }
    return authorsArray
  } else {
    return []
  }
}

export default schemaGenerator
