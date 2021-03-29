export const pageview = path =>
  'gtag' in globalThis &&
  gtag('event', 'page_view', {
    page_path: path,
  })

export const event = ({ category, action, label }) =>
  'gtag' in globalThis &&
  gtag('event', action, {
    event_category: category,
    event_label: label,
  })
