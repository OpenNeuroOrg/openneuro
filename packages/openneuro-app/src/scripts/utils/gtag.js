/*global globalThis*/
globalThis.dataLayer = globalThis.dataLayer || []

function gtag() {
  // eslint-disable-next-line prefer-rest-params
  globalThis.dataLayer.push(arguments)
}

gtag("js", new Date())

export const initialize = (trackingIds) =>
  trackingIds?.forEach((trackingId) => gtag("config", trackingId))

export const pageview = (path) =>
  gtag("event", "page_view", {
    page_path: path,
  })

export const event = ({ category, action, label }) =>
  gtag("event", action, {
    event_category: category,
    event_label: label,
  })
