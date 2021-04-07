/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace NodeJS {
  interface Global {
    document: any
    HTMLElement: any
    HTMLAnchorElement: any
  }
}
