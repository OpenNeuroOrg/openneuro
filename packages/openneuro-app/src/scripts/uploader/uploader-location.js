// Helper functions for navigating the uploader dialog
export const locationFactory = pathname => ({
  pathname,
  state: { uploader: true },
})
