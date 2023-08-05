import { PageData } from '@/types'
import { getPageData } from '@/methods/getPageData'
import { endPageSession, startPageSession } from '@/methods/pageSession'
import { removeEvents, trackEvents } from '@/methods/trackEvents'
import { sendDefaultEvent } from '@/methods/sendEvent'

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
  }, 1000)
}

export { enableSPATracking }
