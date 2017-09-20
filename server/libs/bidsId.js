/**
 * Hex
 *
 * Utils for dealing with hex encoding
 */
export default {
  hexToASCII(hexString) {
    var hex = hexString.toString()
    var str = ''
    for (var n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16))
    }
    return str
  },

  hexFromASCII(string) {
    return string
      .split('')
      .map(c => {
        return ('0' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  },

  encodeId(id) {
    if (/ds\d{6}/.test(id)) {
      return this.hexFromASCII('    ' + id)
    } else if (/\d{6}-\d{5}/.test(id)) {
      return this.hexFromASCII(id)
    } else {
      return id
    }
  },

  decodeId(id) {
    let decodedId = this.hexToASCII(id)
    if (/\s{4}ds\d{6}/.test(decodedId)) {
      return decodedId.slice(4)
    } else if (/\d{6}-\d{5}/.test(decodedId)) {
      return decodedId.slice(7)
    }
    return id
  },
}
