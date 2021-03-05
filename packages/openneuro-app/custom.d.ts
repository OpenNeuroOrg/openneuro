declare module '*.png' {
  const value: any
  export = value
}

// TODO - Remove when openneuro-content is merged in
declare module 'openneuro-content' {
  const frontPage: any
  const theme: any
  const faq: any
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
