// Workaround for incorrect global reference in draft.js via fbjs
interface Object {
  // eslint-disable-next-line @typescript-eslint/ban-types
  global: object
}

// eslint-disable-next-line @typescript-eslint/ban-types
function polyfillGlobal(): object {
  if (typeof global !== 'undefined') return global
  Object.defineProperty(Object.prototype, 'global', {
    get: function () {
      delete Object.prototype.global
      this.global = this
    },
    configurable: true,
  })
  return global
}
polyfillGlobal()
