/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  namespace Express {
    interface Request {
      isAuthenticated?: () => boolean
      user?: any
    }
  }
}

export {}
