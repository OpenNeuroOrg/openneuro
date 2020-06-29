import config from '../config.js'

export const addFileUrl = (datasetId, tag) => file => {
  // Skip files annotated with a URL from datalad service
  if (file.urls.length > 0) {
    return file
  } else {
    // This is a draft, files are local and no URLs defined
    const filePath = file.filename.replace(/\//g, ':')
    if (tag) {
      // Snapshot
      // Backup URL for direct access for private datasets
      const fileUrl = `${config.url}${config.apiPrefix}datasets/${datasetId}/snapshots/${tag}/files/${filePath}`
      return { ...file, urls: [fileUrl] }
    } else {
      // Dataset draft
      const fileUrl = `${config.url}${config.apiPrefix}datasets/${datasetId}/files/${filePath}`
      return { ...file, urls: [fileUrl] }
    }
  }
}
