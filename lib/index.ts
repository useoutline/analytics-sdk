import { init } from '@/methods/init'
import type {
  InitOptions,
  AnalyticsEvent,
  PageData,
  AnalyticsEvents,
} from '@/types'

export default init
type Analytics = ReturnType<typeof init>
export type {
  InitOptions as AnalyticsOptions,
  AnalyticsEvent,
  PageData,
  AnalyticsEvents,
  Analytics,
}
