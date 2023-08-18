import { PageData } from '@/types'
import { getPageData } from '@/methods/getPageData'
import { endPageSession, startPageSession } from '@/methods/pageSession'
import { removeEvents, trackEvents } from '@/methods/trackEvents'
import { sendDefaultEvent } from '@/methods/sendEvent'
import logger from '@/logger'

let pageBeforePopstate: PageData

function enableSPATracking() {
  const pushState = history.pushState
  const replaceState = history.replaceState
  pageBeforePopstate = getPageData()

  history.pushState = function (...args) {
    logger.log('Tracking push state')
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

  history.replaceState = function (...args) {
    logger.log('Tracking replace state')
    removeEvents()
    const page = getPageData()
    page.meta = { ...page.meta, event: 'replaceState' }
    endPageSession(page)
    pageBeforePopstate = page
    const [data, unused, url] = args
    replaceState.apply(history, [data, unused, url])
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
  }, 1000)
}

export { enableSPATracking }
