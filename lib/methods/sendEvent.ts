import { trackEvent } from '../apis'
import logger from '../logger'
import state from '../state'
import { EventKind, PageMeta } from '../types'
import { getPageData } from './getPageData'
import { getPageMeta } from './getPageMeta'

function sendEvent(event: string) {
  if (state.getState().trackingState !== 'tracking') return
  const page = getPageData()
  const meta: PageMeta = getPageMeta()
  page.meta = page.meta ? { ...page.meta, ...meta } : meta
  trackEvent('external', event, page)
  logger.log(`Custom event sent`, event)
}

function sendDefaultEvent(type: EventKind, event: string) {
  if (state.getState().trackingState !== 'tracking') return
  const page = getPageData()
  const meta: PageMeta = getPageMeta()
  page.meta = page.meta ? { ...page.meta, ...meta } : meta
  trackEvent(type, event, page)
  logger.log(
    `${type === 'internal' ? 'Internal' : 'Tag based'} event sent`,
    event
  )
}

export { sendEvent, sendDefaultEvent }
