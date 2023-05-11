import state from '../state'
import { Selector } from '../types'
import { sendDefaultEvent } from './sendEvent'

function isCorrectPage(pagePath: string) {
  return !pagePath || pagePath === window.location.pathname || pagePath === '*'
}

function getSelector(selector: Selector) {
  if (!selector || selector === 'document') {
    return [document]
  }
  if (selector === 'window') {
    return [window]
  }
  return document.querySelectorAll(selector)
}

function trackEvents() {
  const events = state.getState().analyticsEvents
  events.forEach((event) => {
    if (isCorrectPage(event.page as string)) {
      let selectors:
        | Document[]
        | (Window & typeof globalThis)[]
        | NodeListOf<Element>
        | HTMLElement[] = []
      if (event.selectorType === 'id') {
        const selector = document.getElementById(event.selector)
        selectors = selector ? [selector] : []
      } else if (event.selectorType === 'text' && event.text?.length) {
        document.querySelectorAll(event.selector || '*').forEach((node) => {
          if (
            !node.children.length &&
            (node as HTMLElement).innerText
              ?.toLowerCase()
              .includes((event.text as string).toLowerCase())
          )
            (selectors as HTMLElement[]).push(node as HTMLElement)
        })
      } else {
        selectors = getSelector(event.selector)
      }
      selectors.forEach((el) => {
        el.addEventListener(event.trigger, () => {
          sendDefaultEvent('tag-based', event.event)
        })
      })
    }
  })
}

function removeEvents() {
  const events = state.getState().analyticsEvents
  events.forEach((event) => {
    const selectors = getSelector(event.selector)
    selectors.forEach((el) => {
      el.removeEventListener(event.trigger, () => {
        sendDefaultEvent('tag-based', event.event)
      })
    })
  })
}

export { trackEvents, removeEvents }
