// Workaround for incorrect global reference in draft.js via fbjs
interface Object {
  // eslint-disable-next-line @typescript-eslint/ban-types
  global: object
}

function polyfillGlobal(): void {
  if (typeof global === 'object') return
  Object.defineProperty(Object.prototype, 'global', {
    get: () => globalThis,
    configurable: true,
  })
}

polyfillGlobal()
