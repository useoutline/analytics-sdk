import { trackSession } from '@/apis'
import logger from '@/logger'
import state from '@/state'
import type { PageData } from '@/types'
import { getPageData } from '@/methods/getPageData'

let pageVisitedTime: number
let sessionPageData: PageData

function startPageSession() {
  pageVisitedTime = Date.now()
  sessionPageData = getPageData()
  logger.log('Page session started', `"${window.location.pathname}"`)
}

function endPageSession(page?: Partial<PageData>) {
  if (pageVisitedTime === 0) return
  if (state.value.trackingState !== 'tracking') return
  const pageLeftTime = Date.now()
  const trackingPage = page
    ? {
        ...sessionPageData,
        ...page,
      }
    : sessionPageData
  if (!state.value.mock) {
    trackSession(trackingPage, pageVisitedTime, pageLeftTime)
  }
  pageVisitedTime = 0
  sessionPageData = {} as PageData
  logger.log(
    'Page session ended',
    `"${new URL(trackingPage.fullpath).pathname}"`
  )
}

export { startPageSession, endPageSession }
