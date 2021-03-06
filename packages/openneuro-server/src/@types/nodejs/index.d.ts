declare module NodeJS  {
  interface Global {
      document: any
      HTMLElement: any
      HTMLAnchorElement: any
  }
}