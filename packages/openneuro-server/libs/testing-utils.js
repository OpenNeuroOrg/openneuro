import http from 'http'

export default {
  ok(res) {
    if (res.status !== 200) {
      const b = http.STATUS_CODES[res.status]
      return new Error(
        'expected 200, got ' +
          res.status +
          ' "' +
          b +
          '" with message: ' +
          res.text,
      )
    }
  },
}
