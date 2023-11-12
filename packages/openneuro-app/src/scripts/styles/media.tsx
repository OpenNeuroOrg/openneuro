import React from "react"
import { createMedia } from "@artsy/fresnel"
import "@artsy/fresnel/dist/Media"

const AppMedia = createMedia({
  breakpoints: {
    small: 0,
    medium: 768,
  },
})

// Generate CSS to be injected into the head
export const mediaStyle = AppMedia.createMediaStyle()
export const { Media, MediaContextProvider } = AppMedia
