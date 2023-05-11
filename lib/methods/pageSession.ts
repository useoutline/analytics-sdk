import { trackSession } from '../apis'
import logger from '../logger'
import state from '../state'
import type { PageData, PageMeta } from '../types'
import { getPageData } from './getPageData'
import { getPageMeta } from './getPageMeta'

let pageVisitedTime: string
let pageMeta: PageMeta

function startPageSession() {
  pageVisitedTime = new Date().toISOString()
  pageMeta = getPageMeta()
  logger.log('Page session started')
}

function endPageSession(page?: PageData) {
  if (state.getState().trackingState !== 'tracking') return
  const pageLeftTime = new Date().toISOString()
  const trackingPage = page || getPageData()
  trackingPage.meta = trackingPage.meta
    ? { ...trackingPage.meta, ...pageMeta }
    : pageMeta
  trackSession(trackingPage, pageVisitedTime, pageLeftTime)
  logger.log('Page session ended and tracked')
}

export { startPageSession, endPageSession }
