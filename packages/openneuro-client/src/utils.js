export const debounce = (fn, time) => {
  let timeout

  return () => {
    const functionCall = (...args) => fn.apply(this, args)

    clearTimeout(timeout)
    timeout = global.setTimeout(functionCall, time)
  }
}
