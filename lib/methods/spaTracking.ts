import { trackEvent } from '../apis'
import { PageData } from '../types'
import { getPageData } from './getPageData'
import { endPageSession, startPageSession } from './pageSession'
import logger from '../logger'

let pageBeforePopstate: PageData

function enableSpaTracking() {
  const pushState = history.pushState

  history.pushState = function (...args) {
    logger.log('Triggered pushState')
    const page = getPageData()
    endPageSession(page)
    pageBeforePopstate = page
    const [data, unused, url] = args
    pushState.apply(history, [data, unused, url])
    trackPageAfterChange()
  }

  window.addEventListener('popstate', () => {
    logger.log('Triggered popstate')
    endPageSession(pageBeforePopstate)
    trackPageAfterChange()
  })
}

function trackPageAfterChange() {
  setTimeout(() => {
    const page = getPageData()
    trackEvent('internal', 'pageview', page)
    startPageSession()
  }, 100)
}

export { enableSpaTracking }
