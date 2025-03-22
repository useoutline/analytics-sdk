import { describe, test, expect } from 'vitest'
import { getPageData } from '../../lib/methods/getPageData'

describe('getPageData', () => {
  test('Get page data', () => {
    const pageData = getPageData()
    expect(pageData).toHaveProperty('title')
    expect(pageData).toHaveProperty('fullpath')
    expect(pageData).toHaveProperty('referrer')
  })
})
