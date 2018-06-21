import config from '../config.js'

export const addFileUrl = (datasetId, tag, externalFiles) => file => {
  // This is a draft, files are local
  const filePath = file.filename.replace(/\//g, ':')
  if (tag) {
    // Snapshot
    const urls = []

    // Published snapshot S3 URL
    if (externalFiles) {
      const match = externalFiles.filter(
        fileObj => fileObj.filename === file.filename,
      )
      const matchedFile = match ? match.pop() : null
      // If any matches are found, merge in the urls
      if (matchedFile) urls.push(...matchedFile.urls)
    } else {
      // Backup URL for direct access
      const fileUrl = `${config.url}${
        config.apiPrefix
      }datasets/${datasetId}/snapshots/${tag}/files/${filePath}`
      urls.push(fileUrl)
    }
    return { ...file, urls }
  } else {
    // Dataset draft
    const fileUrl = `${config.url}${
      config.apiPrefix
    }datasets/${datasetId}/files/${filePath}`
    return { ...file, urls: [fileUrl] }
  }
}
