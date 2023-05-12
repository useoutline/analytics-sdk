import { PageData } from '../types'
import { getPageData } from './getPageData'
import { endPageSession, startPageSession } from './pageSession'
import { removeEvents, trackEvents } from './trackEvents'
import { sendDefaultEvent } from './sendEvent'

let pageBeforePopstate: PageData

function enableSPATracking() {
  const pushState = history.pushState

  history.pushState = function (...args) {
    removeEvents()
    const page = getPageData()
    page.meta = { ...page.meta, event: 'pushState' }
    endPageSession(page)
    pageBeforePopstate = page
    const [data, unused, url] = args
    pushState.apply(history, [data, unused, url])
    trackPageAfterChange()
    trackEvents()
  }

  window.addEventListener('popstate', () => {
    removeEvents()
    pageBeforePopstate.meta = { ...pageBeforePopstate.meta, event: 'popstate' }
    endPageSession(pageBeforePopstate)
    trackPageAfterChange()
    trackEvents()
  })
}

function trackPageAfterChange() {
  setTimeout(() => {
    sendDefaultEvent('internal', 'pageview')
    startPageSession()
  }, 100)
}

export { enableSPATracking }
