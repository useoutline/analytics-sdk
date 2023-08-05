import state from '@/state'
import type { PageData } from '@/types'
import { getPageMeta } from '@/methods/getPageMeta'

function getPageData() {
  const page: PageData = {
    path: window.location.pathname,
    title: document.title,
  }
  if (state.value.extendedPageData) {
    page.query = window.location.search
    page.hash = window.location.hash
    page.fullpath = window.location.href
  }
  page.meta = getPageMeta()
  return page
}

export { getPageData }
