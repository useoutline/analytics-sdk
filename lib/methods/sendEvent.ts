import { trackEvent } from '@/apis'
import logger from '@/logger'
import state from '@/state'
import { EventKind } from '@/types'
import { getPageData } from '@/methods/getPageData'

function sendEvent(event: string, data?: Record<string, string | number>) {
  if (state.value.trackingState !== 'tracking') return
  const page = getPageData()
  if (!state.value.mock) {
    trackEvent('external', event, page, data || state.value.data)
  }
  logger.log(`Custom event`, `"${event}"`)
}

function sendDefaultEvent(type: EventKind, event: string) {
  if (state.value.trackingState !== 'tracking') return
  const page = getPageData()
  if (!state.value.mock) {
    trackEvent(type, event, page, state.value.data)
  }
  logger.log(
    `${type === 'internal' ? 'Internal' : 'Tag-based'} event`,
    `"${event}"`
  )
}

export { sendEvent, sendDefaultEvent }
