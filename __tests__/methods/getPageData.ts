import { getPageData } from '../../lib/methods/getPageData'
import state from '../../lib/state'

describe('getPageData', () => {
  state.setState({ extendedPageData: true })
  test('Get page data', () => {
    const pageData = getPageData()
    expect(pageData).toHaveProperty('path')
    expect(pageData).toHaveProperty('title')
    expect(pageData).toHaveProperty('query')
    expect(pageData).toHaveProperty('hash')
    expect(pageData).toHaveProperty('fullpath')
    expect(pageData).toHaveProperty('meta')
    expect(pageData.meta).toHaveProperty('referrer')
    expect(pageData.meta).toHaveProperty('utm_source')
    expect(pageData.meta).toHaveProperty('utm_medium')
    expect(pageData.meta).toHaveProperty('utm_campaign')
    expect(pageData.meta).toHaveProperty('utm_term')
    expect(pageData.meta).toHaveProperty('utm_content')
  })
})
