function debounce(f, ms) {
  let timeout = null

  return function(...args) {
    clearTimeout(timeout)

    timeout = setTimeout(() => {
      f.apply(this, args)
    }, ms)
  }
}

export { debounce }