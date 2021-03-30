globalThis.dataLayer = globalThis.dataLayer || []

function gtag(...args) {
  globalThis.dataLayer.push(...args)
}

gtag('js', new Date())

export const initialize = trackingId => gtag('config', trackingId)

export const pageview = path =>
  gtag('event', 'page_view', {
    page_path: path,
  })

export const event = ({ category, action, label }) =>
  gtag('event', action, {
    event_category: category,
    event_label: label,
  })
