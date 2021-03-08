declare global {
  namespace Express {
    interface Request {
      isAuthenticated?: () => boolean
      user?: any
    }
  }
}

export {}
