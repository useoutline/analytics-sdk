import type { PageData } from '@/types'

function getPageData() {
  const page: PageData = {
    title: document.title,
    fullpath: window.location.href,
    referrer: document.referrer,
  }
  return page
}

export { getPageData }
