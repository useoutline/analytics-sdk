import { trackSession } from '../apis'
import logger from '../logger'
import state from '../state'
import type { PageData } from '../types'
import { getPageData } from './getPageData'

let pageVisitedTime: string

function startPageSession() {
  pageVisitedTime = new Date().toISOString()
  logger.log('Page session started', `"${window.location.pathname}"`)
}

function endPageSession(page?: PageData) {
  if (state.value.trackingState !== 'tracking') return
  const pageLeftTime = new Date().toISOString()
  const trackingPage = page || getPageData()
  if (!state.value.mock) {
    trackSession(trackingPage, pageVisitedTime, pageLeftTime)
  }
  logger.log('Page session ended', `"${trackingPage.path}"`)
}

export { startPageSession, endPageSession }
