export const xhrFetch = uploader => (url, opts = {}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(opts.method || 'get', url)
    xhr.withCredentials = true

    for (const k in opts.headers || {}) xhr.setRequestHeader(k, opts.headers[k])

    xhr.onload = e => {
      resolve({
        ok: e.target.status >= 200 && e.target.status < 300,
        text: () => Promise.resolve(e.target.responseText),
        json: () => Promise.resolve(JSON.parse(e.target.responseText)),
        status: e.target.status,
      })
    }

    xhr.onerror = reject

    if (xhr.upload) {
      xhr.upload.onprogress = uploader.uploadProgress
      uploader.setState({ xhr })
    }

    xhr.send(opts.body)
  })
}
