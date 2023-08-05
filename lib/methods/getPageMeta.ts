import type { PageMeta } from '@/types'

function getPageMeta(): PageMeta {
  const pageUrl = new URL(window.location.href)
  return {
    referrer: document.referrer,
    utm_source: pageUrl.searchParams.get('utm_source'),
    utm_medium: pageUrl.searchParams.get('utm_medium'),
    utm_campaign: pageUrl.searchParams.get('utm_campaign'),
    utm_term: pageUrl.searchParams.get('utm_term'),
    utm_content: pageUrl.searchParams.get('utm_content'),
  }
}

export { getPageMeta }
