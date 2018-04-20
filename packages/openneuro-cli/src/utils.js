export const debounce = (fn, time) => {
  let timeout

  return () => {
    const functionCall = () => fn.apply(this, arguments)

    clearTimeout(timeout)
    timeout = setTimeout(functionCall, time)
  }
}
