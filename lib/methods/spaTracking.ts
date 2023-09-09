import { PageData } from '@/types'
import { getPageData } from '@/methods/getPageData'
import { endPageSession, startPageSession } from '@/methods/pageSession'
import { trackEvents } from '@/methods/trackEvents'
import { sendDefaultEvent } from '@/methods/sendEvent'
import logger from '@/logger'

let pageBeforePopstate: PageData

function generateHistoryState(
  historyStateVal: 'pushState' | 'replaceState',
  historyStateVar: typeof history.pushState | typeof history.replaceState
) {
  logger.log("Tracking history's", historyStateVal)
  history[historyStateVal] = function (...args) {
    endPageSession({ meta: { event: historyStateVal } })
    const [data, unused, url] = args
    historyStateVar.apply(history, [data, unused, url])
    const currentPagePath = window.location.href
    setTimeout(() => {
      const page = getPageData()
      pageBeforePopstate = page
      if (page.fullpath === currentPagePath) {
        trackPageAfterChange()
        trackEvents()
      }
    }, 1500)
  }
}

function enableSPATracking() {
  const pushState = history.pushState
  const replaceState = history.replaceState
  pageBeforePopstate = getPageData()

  generateHistoryState('pushState', pushState)
  generateHistoryState('replaceState', replaceState)

  window.addEventListener('popstate', () => {
    trackEvents({ remove: true })
    pageBeforePopstate.meta = { ...pageBeforePopstate.meta, event: 'popstate' }
    endPageSession(pageBeforePopstate)
    setTimeout(() => {
      pageBeforePopstate = getPageData()
      trackPageAfterChange()
      trackEvents()
    }, 1500)
  })
}

function trackPageAfterChange() {
  sendDefaultEvent('internal', 'pageview')
  startPageSession()
}

export { enableSPATracking }
