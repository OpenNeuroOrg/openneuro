import Remarkable from 'remarkable'
let md = new Remarkable({
  linkify: true,
})

export default {
  /**
     * format
     *
     * Takes a string and return and object with a
     * _html property with linkified & markdown
     * rendered html
     */
  format(value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value, null, 4)
    }
    return { __html: md.render(value) }
  },
}
