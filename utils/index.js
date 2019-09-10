export function debounce(f, ms) {
  let timeout = null

  return function(...args) {
    clearTimeout(timeout)

    timeout = setTimeout(() => {
      f.apply(this, args)
    }, ms)
  }
}

export function isComponent(vnode, componentName) {
  const regex = new RegExp(`vue-component-\\d+-${componentName}`)
  return regex.test(vnode.tag)
}
