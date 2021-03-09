declare module '*.png' {
  const value: string
  export = value
}

interface ServiceWorkerRegistration {
  backgroundFetch: any
}

interface File {
  webkitRelativePath: string
}

interface Blob {
  name: string
  webkitRelativePath: string
}

interface Window {
  showDirectoryPicker: any
}

interface Navigator {
  connection: {
    downlink: number
    downlinkMax: number
    effectiveType: string
    rtt: number
    saveData: boolean
    type: string
  }
}
