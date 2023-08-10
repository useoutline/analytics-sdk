import { trackSession } from '@/apis'
import logger from '@/logger'
import state from '@/state'
import type { PageData } from '@/types'
import { getPageData } from '@/methods/getPageData'

let pageVisitedTime: number

function startPageSession() {
  pageVisitedTime = Date.now()
  logger.log('Page session started', `"${window.location.pathname}"`)
}

function endPageSession(page?: PageData) {
  if (state.value.trackingState !== 'tracking') return
  const pageLeftTime = Date.now()
  const trackingPage = page || getPageData()
  if (!state.value.mock) {
    trackSession(trackingPage, pageVisitedTime, pageLeftTime)
  }
  logger.log(
    'Page session ended',
    `"${new URL(trackingPage.fullpath).pathname}"`
  )
}

export { startPageSession, endPageSession }
