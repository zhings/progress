const doc = document
const assign = Object.assign

function createElement(tagName) {
  return doc.createElement(tagName)
}

const defaults = {
  size: 2,
  color: '#29e',
  className: 'progress-bar',
  delay: 80,
}

const startedStyle = {
  opacity: 1,
  width: '99%',
  transition: 'width 10s cubic-bezier(0.1, 0.05, 0, 1)',
}

const finishedStyle = {
  opacity: 0,
  width: '100%',
  transition: 'width 0.1s ease-out, opacity 0.5s ease 0.2s',
}

const glowStyle = {
  opacity: 0.4,
  boxShadow: '3px 0 8px',
  height: '100%',
}

/**
 *
 * @param {Object} [options]
 * @param {number|string} [options.size] The size (height) of the progress bar.
 * @param {string} [options.color] Color of the progress bar.
 * @param {string} [options.className] Classname for the progress bar element.
 * @param {number} [options.delay] How many milliseconds to wait before the
 * progress bar. animation starts after calling .start().
 * @returns {{ start: () => void, done: () => void }}
 */

export default function Progress(options) {
  const config = assign({}, defaults, options)

  const initialStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    margin: 0,
    padding: 0,
    border: 'none',
    borderRadius: 0,
    backgroundColor: config.color,
    zIndex: 10000,
    height: typeof config.size === 'number' ? config.size + 'px' : config.size,
    color: config.color,
    opacity: 0,
    width: '0%',
  }

  /** @type {number | null} */
  let timeout = null

  /** @type {HTMLElement | null} */
  let current = null

  function clearTimer() {
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  function start() {
    if (current && current.parentNode) {
      current.parentNode.removeChild(current)
    }

    current = doc.body.appendChild(createElement('div'))
    current.className = config.className + ' stopped'
    assign(current.style, initialStyle)

    const glow = current.appendChild(createElement('div'))
    glow.className = 'glow'
    assign(glow.style, glowStyle)

    clearTimer()
    timeout = setTimeout(function () {
      timeout = null
      current.className = config.className + ' started'
      assign(current.style, startedStyle)
    }, config.delay)

    // Force a reflow, just to be sure that the initial style takes effect.
    current.scrollTop = 0
  }

  function done() {
    clearTimer()
    if (current) {
      current.className = config.className + ' finished'
      assign(current.style, finishedStyle)
    }
  }

  return { start, done }
}
