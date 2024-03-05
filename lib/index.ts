import { init } from '@/methods/init'
import type {
  AnalyticsOptions,
  AnalyticsEvent,
  PageData,
  AnalyticsEvents,
} from '@/types'

export default init
type Analytics = ReturnType<typeof init>
export type {
  AnalyticsOptions,
  AnalyticsEvent,
  PageData,
  AnalyticsEvents,
  Analytics,
}
