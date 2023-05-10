import state from '../state'
import type { PageData } from '../types'

function getPageData() {
  const page: PageData = {
    path: window.location.pathname,
  }
  if (state.getState().extendedPageData) {
    page.query = window.location.search
    page.hash = window.location.hash
    page.fullpath = window.location.href
    page.title = document.title
  }
  return page
}

export { getPageData }
