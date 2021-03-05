declare namespace Express {
  export interface Request {
    isAuthenticated?: () => boolean
    user?: any
  }
}

declare module NodeJS  {
  interface Global {
      document: any
      HTMLElement: any
      HTMLAnchorElement: any
  }
}