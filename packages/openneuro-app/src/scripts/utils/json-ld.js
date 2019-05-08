const schemaGenerator = snapshot => {
  try {
    const schema = {
      '@context': 'http://schema.org',
      '@type': 'Dataset',
      name: snapshot.description.Name,
      author: formatAuthors(snapshot.description.Authors),
      datePublished: snapshot.created,
      dateModified: snapshot.created,
      license: snapshot.license,
      publisher: 'OpenNeuro',
      description: snapshot.readme,
      version: snapshot.tag,
      url: `https://openneuro.org/datasets/${
        snapshot.id.split(':')[0]
      }/versions/${snapshot.tag}`,
    }

    if (snapshot.description.DatasetDOI) {
      schema.identifier = [snapshot.description.DatasetDOI]
    }
    return JSON.stringify(schema)
  } catch (e) {
    console.error(e)
    return null
  }
}

const formatAuthors = authorList => {
  if (authorList.length) {
    const authorsArray = []
    for (let author of authorList) {
      const authorObj = {
        '@type': 'Person',
        name: author,
      }
      // Attempt to handle common "Poldrack, R.A." format
      if (author.includes(',')) {
        const [familyName, givenName] = author.split(',')
        authorObj.familyName = familyName
        authorObj.givenName = givenName
      } else {
        // Probably "Russ Poldrack" name?
        const nameTokens = author.split(' ') || []
        authorObj.givenName = nameTokens
          .slice(0, nameTokens.length - 1)
          .join(' ')
        authorObj.familyName = nameTokens[nameTokens.length - 1]
      }
      authorsArray.push(authorObj)
    }
    return authorsArray
  } else {
    return []
  }
}

export default schemaGenerator
