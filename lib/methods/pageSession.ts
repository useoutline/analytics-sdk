import { trackSession } from '../apis'
import logger from '../logger'
import state from '../state'
import type { PageData } from '../types'
import { getPageData } from './getPageData'

let pageVisitedTime: string

function startPageSession() {
  pageVisitedTime = new Date().toISOString()
  logger.log('Page session started')
}

function endPageSession(page?: PageData) {
  if (state.getState().trackingState !== 'tracking') return
  const pageLeftTime = new Date().toISOString()
  const trackingPage = page || getPageData()
  trackSession(trackingPage, pageVisitedTime, pageLeftTime)
  logger.log('Page session ended')
}

export { startPageSession, endPageSession }
