/* eslint-disable @typescript-eslint/no-explicit-any */
// Allow .png imports
declare module "*.png" {
  const value: string
  export = value
}

// Allow .svg imports
declare module "*.svg" {
  const value: string
  export = value
}

// Allow custom scss modules
declare module "*.module.scss" {
  const classes: { [key: string]: string }
  export default classes
}

// Allow .scss imports
declare module "*.scss" {
  const value: string
  export = value
}

// Misc interfaces fixing up common types
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
