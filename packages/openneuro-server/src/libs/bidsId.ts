/**
 * Hex
 *
 * Utils for dealing with hex encoding
 */
export default {
  hexToASCII(hexString) {
    const hex = hexString.toString()
    let str = ''
    for (let n = 0; n < hex.length; n += 2) {
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
    const decodedId = this.hexToASCII(id)
    if (/\s{4}ds\d{6}/.test(decodedId)) {
      return decodedId.slice(4)
    } else if (/\d{6}-\d{5}/.test(decodedId)) {
      return decodedId.slice(7)
    }
    return id
  },

  decode(id) {
    const decodedId = this.hexToASCII(id)
    let datasetId = null
    let tag = null
    // decodes the two different formats of storing dataset + snapshot tag
    if (/\s{4}ds\d{6}/.test(decodedId)) {
      datasetId = decodedId.slice(4)
    } else if (/\d{6}-\d{5}/.test(decodedId)) {
      tag = decodedId.slice(7)
      datasetId = 'ds' + decodedId.slice(0, 6)
    } else {
      // handles all these old dataset ids that start with 57 or 58
      if (id.startsWith('57') || id.startsWith('58')) {
        datasetId = id
      } else {
        // if the id is of the proper length but has no ds, add ds.
        // otherwise, add it is short and needs a 0 as well
        const beginning = id.length == 6 ? 'ds' : 'ds0'
        datasetId = beginning + id
      }
    }
    return { datasetId, tag }
  },
}
