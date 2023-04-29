import { trackSession } from '../apis'
import logger from '../logger'
import state from '../state'
import { PageData } from '../types'
import { getPageData } from './getPageData'

let pageVisitedTime: string

function startPageSession() {
  pageVisitedTime = new Date().toISOString()
  logger.log('Page session started')
  const page = getPageData()
  window.addEventListener('beforeunload', () => {
    logger.log('beforeunload')
    endPageSession(page)
  })
}

function endPageSession(page?: PageData) {
  if (state.getTrackingState() !== 'tracking') return
  const pageLeftTime = new Date().toISOString()
  trackSession(page || getPageData(), pageVisitedTime, pageLeftTime)
  window.removeEventListener('beforeunload', () => {
    //
  })
  logger.log('Page session ended and tracked')
}

export { startPageSession, endPageSession }
