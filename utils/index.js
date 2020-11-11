export function debounce(f, ms) {
  let timeout = null

  return function(...args) {
    clearTimeout(timeout)

    timeout = setTimeout(() => {
      f.apply(this, args)
    }, ms)
  }
}

/*
  use:
  var apples = declOfNum(['Яблоко', 'Яблока', 'Яблок']);
  apples(0) // Яблок
  apples(1) // Яблоко
  apples(2) // Яблока
*/
export function declOfNum(titles) {
  const cases = [2, 0, 1, 1, 1, 2]
  return function(number) {
    return titles[
      number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]
    ]
  }
}

const normalizeTime = (time) => (time < 10 ? '0' + time : time)

export function computeTimeAgo(a, b) {
  const difference = Math.abs(a - b)

  // less than minute
  if (difference < 60)
    return {
      time: `${difference} ${declOfNum(['секунда', 'секунды', 'секунд'])(difference)} назад`,
      description: 'seconds'
    }

  const HOUR = 3600
  const MINUTE = 60

  if (difference < HOUR) {
    const minutes = Math.floor(difference / MINUTE)
    return {
      time: `${minutes} ${declOfNum(['минута', 'минуты', 'минут'])(minutes)} назад`,
      description: 'minutes'
    }
  }

  const DAY = 86400
  const date = new Date(b * 1000)

  // is day - today
  if (isDateEqual(a * 1000, b * 1000))
    return {
      time: `сегодня в ${normalizeTime(date.getHours())}:${normalizeTime(date.getMinutes())}`,
      description: 'today'
    }

  const day = date.getUTCDate()

  // is day - yesterday
  if (isDateEqual(b * 1000, a * 1000 - DAY * 1000))
    return {
      time: `вчера в ${normalizeTime(date.getHours())}:${normalizeTime(date.getMinutes())}`,
      description: 'yesterday'
    }

  const month = date.getUTCMonth()

  return {
    time: `${day} ${getMonth(month)} в ${normalizeTime(date.getHours())}:${normalizeTime(
      date.getMinutes()
    )}`,
    description: 'longAgo'
  }
}

export function getMonth(monthNumber) {
  // prettier-ignore
  const months = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек']
  return months[monthNumber]
}

export function isDateEqual(timestampA, timestampB) {
  const dateA = new Date(timestampA)
  const dateB = new Date(timestampB)

  return (
    dateA.getDate() == dateB.getDate() &&
    dateA.getMonth() == dateB.getMonth() &&
    dateA.getFullYear() == dateB.getFullYear()
  )
}

export function lazyLoadImageObserver(options) {
  if (!('IntersectionObserver' in window)) return // Possibly fall back to a more compatible method here

  return new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return

      let target = entry.target
      target.src = target.dataset.src
      if (target.dataset.srcset) target.srcset = target.dataset.srcset
      observer.unobserve(target)
    })
  }, options)
}

export function isComponent(vnode, componentName) {
  const regex = new RegExp(`vue-component-\\d+-${componentName}`)
  return regex.test(vnode.tag)
}

export function scrollHandler(heightHandler, callback) {
  const currentScroll = window.innerHeight + window.scrollY
  const fullScroll = document.body.offsetHeight
  const isHandlable = fullScroll - currentScroll <= heightHandler

  isHandlable && callback()
}

// Swap array elements inside Vue instance
export function swapArrayElement(arr, oldIndex, newIndex) {
  const temp0 = arr[oldIndex]
  const temp1 = arr[newIndex]
  this.$set(arr, newIndex, temp0)
  this.$set(arr, oldIndex, temp1)
}

export function autoResizeTextarea(target, additionalHeight = 0) {
  target.style.height = 'auto'
  target.style.height = target.scrollHeight + additionalHeight + 'px'
}
