import { init } from './methods/init'
import { InitOptions } from './types'

declare global {
  interface Window {
    useOutlineAnalytics:
      | ((
          analyticsId: string,
          options?: InitOptions
        ) => Promise<{
          start: () => void
          stop: () => void
          sendEvent: (event: string) => void
          setData: (data: Record<string, string | number>) => void
        }>)
      | {
          start: () => void
          stop: () => void
          sendEvent: (
            event: string,
            data?: Record<string, string | number> | undefined
          ) => void
          setData: (data: Record<string, string | number>) => void
        }
  }
}

;(function () {
  document.body.onload = function () {
    setTimeout(async () => {
      const analyticsScript = document.querySelector(
        '[data-outline-analytics-id]'
      ) as HTMLScriptElement | null
      if (analyticsScript) {
        const analyticsId = analyticsScript.dataset.outlineAnalyticsId as string
        const serverUrl = analyticsScript.dataset.outlineAnalyticsServerUrl
        const debug = analyticsScript.dataset.outlineAnalyticsDebug
        const mock = analyticsScript.dataset.outlineAnalyticsMock
        const apiVersion = analyticsScript.dataset
          .outlineAnalyticsApiVersion as 'v1'
        const datasets = analyticsScript.dataset
        const keys = Object.keys(datasets)
        const outlineDataKeys = keys.filter((key) =>
          key.startsWith('outlineAnalyticsData')
        )
        const data: Record<string, string | number> = {}
        outlineDataKeys.forEach((key) => {
          const dataKey = key.replace('outlineAnalyticsData', '') as string
          const dataKeyCamelCase =
            dataKey.charAt(0).toLowerCase() + dataKey.slice(1)
          data[dataKeyCamelCase] = datasets[key] as string
        })
        await init(analyticsId, {
          serverUrl,
          debug: debug === 'true' || debug === '',
          mock: mock === 'true' || mock === '',
          data,
          apiVersion,
        })
      }
      window.useOutlineAnalytics = init
    })
  }
})()
