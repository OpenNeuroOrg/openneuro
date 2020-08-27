export class UploadProgress {
  constructor(onProgress, total) {
    this.onProgress = onProgress
    this.state = 0
    this.total = total
    this.uploading = new Set()
    this.failed = new Set()
  }
  increment(n = 1) {
    this.state = this.state + n
    this.onProgress({
      progress: Math.floor((this.state / this.total) * 100),
      uploadingFiles: this.uploading,
      failedFiles: this.failed,
    })
  }
  startUpload(file) {
    this.uploading.add(file)
  }
  finishUpload(file) {
    this.uploading.delete(file)
    this.failed.delete(file)
  }
  failUpload(file) {
    this.uploading.delete(file)
    this.failed.add(file)
  }
}
