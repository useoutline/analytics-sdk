import { createApiInstance, getTrackingEvents } from '@/apis'
import logger from '@/logger'
import state from '@/state'
import type { InitOptions } from '@/types'
import { startPageSession, endPageSession } from '@/methods/pageSession'
import { sendEvent, sendDefaultEvent } from '@/methods/sendEvent'
import { enableSPATracking } from '@/methods/spaTracking'
import { trackEvents } from '@/methods/trackEvents'
import { OUTLINE_API_ENDPOINT, OUTLINE_VISITOR_UID_KEY } from '@/constants'
import { getRandomValue } from '@/methods/randomValues'

let isAlreadyInitialized = false

async function init(analyticsId: string, options?: InitOptions) {
  try {
    if (!isAlreadyInitialized) {
      state.setState({
        analyticsId,
        debug: options?.debug,
        mock: options?.mock,
        data: options?.data,
      })
      logger.log('Initialized with id ', `"${analyticsId}"`)

      const apiVersion = options?.apiVersion || 'v1'
      const serverUrl = options?.serverUrl || OUTLINE_API_ENDPOINT
      createApiInstance(serverUrl, apiVersion)

      const persistedVisitorUid = localStorage.getItem(OUTLINE_VISITOR_UID_KEY)
      const visitorUid = persistedVisitorUid || `OAU-${getRandomValue()}`
      if (!persistedVisitorUid)
        localStorage.setItem(OUTLINE_VISITOR_UID_KEY, visitorUid)
      state.setState({
        analyticsEvents: await getTrackingEvents(),
      })
      state.setState({
        visitorUid,
      })
      startTracking()
      startPageSession()
      sendDefaultEvent('internal', 'pageview')
      enableSPATracking()

      window.addEventListener('pagehide', () => {
        logger.log('Page hide event')
        endPageSession({ meta: { event: 'pagehide' } })
      })
      window.addEventListener('pageshow', (event) => {
        logger.log('Page show event')
        if (event.persisted) {
          startTracking()
          startPageSession()
        }
      })
      document.addEventListener('visibilitychange', () => {
        logger.log('Visibility change', document.visibilityState)
        if (document.visibilityState === 'hidden') {
          endPageSession({ meta: { event: 'visibilitychange' } })
        } else {
          startTracking()
          startPageSession()
        }
      })
      isAlreadyInitialized = true
    } else if (options?.data) {
      state.setState({ data: options.data })
    }

    return {
      error: false,
      start: startTracking,
      stop: stopTracking,
      sendEvent,
      setData: (data: Record<string, string | number>) => {
        state.setState({ data })
      },
    }
  } catch (e) {
    console.error('[Outline Analytics] Error initializing Outline', e)
    return {
      error: true,
      start: () => void 0,
      stop: () => void 0,
      sendEvent: (event: string, data?: Record<string, string | number>) =>
        void 0,
      setData: (data: Record<string, string | number>) => void 0,
    }
  }
}

function startTracking() {
  state.setState({ trackingState: 'tracking' })
  logger.log('Tracking started')
  trackEvents()
}

function stopTracking() {
  state.setState({ trackingState: 'stopped' })
  logger.log('Tracking stopped')
  trackEvents({ remove: true })
}

export { init }
