import { describe, expect, it } from 'vitest'
import type { PageData } from 'vitepress'
import {
  DEFAULT_OG_IMAGE,
  OG_IMAGE_CATALOG,
  resolveOgImage,
  resolveOgImageMeta,
  resolveOgImagePath,
  SITE_URL,
} from '../docs/.vitepress/seo'

function pageData(overrides: Partial<PageData> = {}): PageData {
  return {
    title: 'Test',
    relativePath: 'guide/test.md',
    filePath: '/docs/guide/test.md',
    description: 'Test page',
    frontmatter: {},
    headers: [],
    isNotFound: false,
    ...overrides,
  } as PageData
}

describe('docs SEO helpers', () => {
  it('defaults to the 1200×630 social share image', () => {
    const data = pageData()
    expect(resolveOgImagePath(data)).toBe('/og-share.png')
    expect(resolveOgImage(data)).toBe(`${SITE_URL}og-share.png`)
    expect(resolveOgImageMeta(data)).toEqual(OG_IMAGE_CATALOG['/og-share.png'])
  })

  it('uses catalog dimensions for hero launcher pages', () => {
    const data = pageData({
      frontmatter: {
        ogImage: '/hero-launcher.png',
        ogImageAlt: 'Vertical launcher',
      },
    })
    expect(resolveOgImageMeta(data)).toEqual({
      width: 264,
      height: 660,
      alt: 'Vertical launcher',
    })
  })

  it('allows frontmatter overrides for custom assets', () => {
    const data = pageData({
      frontmatter: {
        ogImage: '/custom.png',
        ogImageWidth: 800,
        ogImageHeight: 418,
        ogImageAlt: 'Custom card',
      },
    })
    expect(resolveOgImageMeta(data)).toEqual({
      width: 800,
      height: 418,
      alt: 'Custom card',
    })
  })

  it('keeps the default OG image URL absolute', () => {
    expect(DEFAULT_OG_IMAGE).toBe(`${SITE_URL}og-share.png`)
  })
})
