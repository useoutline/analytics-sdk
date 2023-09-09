import state from '@/state'
import { Selector } from '@/types'
import { sendDefaultEvent } from '@/methods/sendEvent'

function matchPathPattern(pattern: string, path: string) {
  const patternParts = pattern.split('/')
  const pathParts = path.split('/')
  if (patternParts.length !== pathParts.length) return false
  for (let i = 0; i < patternParts.length; i++) {
    if (!patternParts[i].startsWith(':') && patternParts[i] !== pathParts[i]) {
      return false
    }
  }
  return true
}

function isCorrectPage(pagePath: string) {
  return (
    !pagePath ||
    pagePath === '*' ||
    matchPathPattern(pagePath, window.location.pathname)
  )
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

function trackEvents(data?: { remove?: boolean }) {
  const events = state.value.analyticsEvents
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
            (node as HTMLElement).innerText?.includes(event.text as string)
          )
            (selectors as HTMLElement[]).push(node as HTMLElement)
        })
      } else {
        selectors = getSelector(event.selector)
      }
      selectors.forEach((el) => {
        if (data?.remove)
          el.removeEventListener(event.trigger, () => {
            sendDefaultEvent('tag-based', event.event)
          })
        else
          el.addEventListener(event.trigger, () => {
            sendDefaultEvent('tag-based', event.event)
          })
      })
    }
  })
}

export { trackEvents }
