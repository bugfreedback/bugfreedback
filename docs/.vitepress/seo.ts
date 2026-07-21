import type { HeadConfig, PageData } from 'vitepress'
import pkg from '../../package.json'

export const SITE_ORIGIN = 'https://bugfreedback.github.io'
export const SITE_BASE = '/bugfreedback/'
export const SITE_URL = `${SITE_ORIGIN}${SITE_BASE.replace(/\/$/, '')}/`

export const SITE_NAME = 'bugfreedback'
export const SITE_TAGLINE = 'Capture, annotate, and route feedback reports to the tools your team already uses. Bug-free Feedback'
export const SITE_DESCRIPTION
  = 'Self-hosted Nuxt feedback widget with screenshot capture, annotation, and exports to GitHub Issues, Linear, Slack, Jira, and more — no external feedback portal or subscription required.'

/** Freemium bug-reporting / feedback tools with a permanent free tier */
export const FREEMIUM_COMPETITORS = [
  'Ybug',
  'BetterBugs',
  'Jam.dev',
  'Usersnap',
  'Bugfender',
  'Sentry',
  'Shake',
] as const

/** Subscription-first tools that typically require paid plans after a trial */
export const SUBSCRIPTION_COMPETITORS = [
  'Marker.io',
  'BugHerd',
  'Feedbucket',
  'Userback',
  'Instabug',
  'LogRocket',
] as const

export const BUG_TRACKER_CATEGORY_KEYWORDS = [
  'bug reporting tool',
  'bug tracking software',
  'visual bug reporting',
  'screenshot bug report',
  'in-app feedback widget',
  'user feedback tool',
  'website feedback widget',
  'feedback capture widget',
  'annotated screenshot feedback',
  'self-hosted bug reporting',
  'freemium bug tracker alternative',
  'bug report widget',
  'visual feedback tool',
  'QA feedback widget',
  'product feedback widget',
] as const

export const NUXT_VUE_KEYWORDS = [
  'Nuxt',
  'Nuxt 3',
  'Nuxt 4',
  'Nuxt module',
  'Nuxt feedback module',
  'Nuxt UI',
  'Nitro',
  'Vue',
  'Vue 3',
  'Vue feedback widget',
  'Vue screenshot annotation',
  'Vite',
  'TypeScript Nuxt module',
  'JavaScript feedback widget',
  'Composition API',
  'Vue component library',
] as const

function competitorAlternatives(names: readonly string[]): string[] {
  return names.flatMap(name => [name, `${name} alternative`])
}

export const SITE_KEYWORDS = [
  SITE_NAME,
  ...NUXT_VUE_KEYWORDS,
  ...BUG_TRACKER_CATEGORY_KEYWORDS,
  ...competitorAlternatives(FREEMIUM_COMPETITORS),
  ...competitorAlternatives(SUBSCRIPTION_COMPETITORS),
  'open source feedback widget',
  'GitHub Issues feedback',
  'Linear feedback',
  'Jira feedback',
  'no subscription feedback tool',
].join(', ')

export const DEFAULT_OG_IMAGE = `${SITE_URL}og-share.png`
export const DEFAULT_OG_IMAGE_ALT
  = 'bugfreedback — Feedback for Nuxt with a horizontal Feedback launcher button'

export type OgImageMeta = {
  width: number
  height: number
  alt: string
}

/** Known Open Graph assets under docs/public (path → dimensions). */
export const OG_IMAGE_CATALOG: Record<string, OgImageMeta> = {
  '/og-share.png': {
    width: 1200,
    height: 630,
    alt: DEFAULT_OG_IMAGE_ALT,
  },
  '/og-launcher-horizontal.png': {
    width: 2400,
    height: 160,
    alt: 'bugfreedback horizontal Feedback launcher button',
  },
  '/hero-launcher.png': {
    width: 264,
    height: 660,
    alt: 'bugfreedback Feedback launcher button on the edge of your app',
  },
  '/screenshots/launcher.png': {
    width: 2290,
    height: 667,
    alt: 'bugfreedback Feedback launcher on a sample Nuxt app',
  },
}

export function resolvePagePath(relativePath: string): string {
  return relativePath
    .replace(/(^|\/)index\.md$/, '$1')
    .replace(/\.md$/, '')
    .replace(/\/$/, '')
}

export function resolvePageUrl(relativePath: string): string {
  const path = resolvePagePath(relativePath)
  return path ? `${SITE_URL}${path}` : SITE_URL
}

export function resolvePageTitle(pageData: PageData): string {
  if (pageData.frontmatter.layout === 'home') {
    return `${SITE_NAME} — Feedback for Nuxt`
  }
  if (pageData.title) {
    return `${pageData.title} | ${SITE_NAME}`
  }
  return SITE_NAME
}

export function resolvePageDescription(pageData: PageData): string {
  return String(
    pageData.frontmatter.description
    ?? pageData.description
    ?? SITE_DESCRIPTION,
  )
}

export function resolveOgImage(pageData: PageData): string {
  const custom = pageData.frontmatter.ogImage ?? pageData.frontmatter.image
  if (typeof custom === 'string' && custom.startsWith('http')) {
    return custom
  }
  if (typeof custom === 'string' && custom.length > 0) {
    return `${SITE_URL}${custom.replace(/^\//, '')}`
  }
  return DEFAULT_OG_IMAGE
}

export function resolveOgImageAlt(pageData: PageData): string {
  return String(pageData.frontmatter.ogImageAlt ?? resolveOgImageMeta(pageData).alt)
}

export function resolveOgImagePath(pageData: PageData): string {
  const custom = pageData.frontmatter.ogImage ?? pageData.frontmatter.image
  if (typeof custom === 'string' && custom.length > 0) {
    if (custom.startsWith('http')) {
      try {
        const url = new URL(custom)
        return url.pathname.replace(new RegExp(`^${SITE_BASE.replace(/\/$/, '')}`), '') || '/'
      }
      catch {
        return custom
      }
    }
    return custom.startsWith('/') ? custom : `/${custom}`
  }
  return '/og-share.png'
}

export function resolveOgImageMeta(pageData: PageData): OgImageMeta {
  const customAlt = pageData.frontmatter.ogImageAlt
  const path = resolveOgImagePath(pageData)
  const catalog = OG_IMAGE_CATALOG[path]
  const width = Number(pageData.frontmatter.ogImageWidth ?? catalog?.width ?? 1200)
  const height = Number(pageData.frontmatter.ogImageHeight ?? catalog?.height ?? 630)
  const alt = String(customAlt ?? catalog?.alt ?? DEFAULT_OG_IMAGE_ALT)
  return { width, height, alt }
}

function metaTag(
  key: string,
  content: string,
  attribute: 'name' | 'property' = 'name',
): HeadConfig {
  return ['meta', { [attribute]: key, content }]
}

function linkTag(rel: string, href: string): HeadConfig {
  return ['link', { rel, href }]
}

function jsonLdScript(data: Record<string, unknown>): HeadConfig {
  return ['script', { type: 'application/ld+json' }, JSON.stringify(data)]
}

function buildStructuredData(pageData: PageData, url: string, description: string): HeadConfig[] {
  const tags: HeadConfig[] = [
    jsonLdScript({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': SITE_NAME,
      'url': SITE_URL,
      description,
      'inLanguage': 'en-US',
    }),
    jsonLdScript({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': SITE_NAME,
      'applicationCategory': 'DeveloperApplication',
      'operatingSystem': 'Web',
      url,
      description,
      'softwareVersion': pkg.version,
      'programmingLanguage': ['TypeScript', 'JavaScript', 'Vue'],
      'keywords': SITE_KEYWORDS,
      'alternateName': [
        ...competitorAlternatives(FREEMIUM_COMPETITORS),
        ...competitorAlternatives(SUBSCRIPTION_COMPETITORS),
      ],
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
        'description': 'MIT-licensed open source — no bugfreedback subscription or hosted portal required',
      },
      'featureList': [
        'Nuxt module with Vue 3 components',
        'Screenshot capture and annotation',
        'Export to GitHub Issues, Linear, Jira, Notion, Slack, and more',
        'Self-hosted GCS or S3 screenshot storage',
      ],
    }),
  ]

  if (pageData.frontmatter.layout === 'home') {
    tags.push(jsonLdScript({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': `${SITE_NAME} — Nuxt feedback widget`,
      'url': SITE_URL,
      'browserRequirements': 'Requires JavaScript. Built for Nuxt 3+ and Vue 3 applications.',
      'applicationCategory': 'DeveloperApplication',
      'keywords': [...NUXT_VUE_KEYWORDS, ...BUG_TRACKER_CATEGORY_KEYWORDS].join(', '),
    }))
  }

  return tags
}

export function buildSocialHead(pageData: PageData): HeadConfig[] {
  const title = resolvePageTitle(pageData)
  const description = resolvePageDescription(pageData)
  const url = resolvePageUrl(pageData.relativePath)
  const image = resolveOgImage(pageData)
  const { width: imageWidth, height: imageHeight, alt: imageAlt } = resolveOgImageMeta(pageData)

  const nuxtVueTags = NUXT_VUE_KEYWORDS.slice(0, 8).join(', ')
  const bugTrackerTags = BUG_TRACKER_CATEGORY_KEYWORDS.slice(0, 6).join(', ')
  const competitorTags = [
    ...FREEMIUM_COMPETITORS,
    ...SUBSCRIPTION_COMPETITORS,
  ].join(', ')

  return [
    metaTag('description', description),
    metaTag('keywords', SITE_KEYWORDS),
    metaTag('subject', `${bugTrackerTags}, ${nuxtVueTags}`),
    metaTag('classification', 'Developer Tools / Bug Tracking / User Feedback'),
    metaTag('category', 'bug tracking, feedback widget, Nuxt module, Vue component'),
    metaTag('coverage', 'Worldwide'),
    metaTag('distribution', 'global'),
    metaTag('rating', 'general'),
    metaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'),
    metaTag('author', SITE_NAME),
    metaTag('publisher', SITE_NAME),
    metaTag('application-name', SITE_NAME),
    metaTag('apple-mobile-web-app-title', SITE_NAME),
    metaTag('apple-mobile-web-app-capable', 'yes'),
    metaTag('mobile-web-app-capable', 'yes'),
    metaTag('theme-color', '#0ea5e9'),
    metaTag('color-scheme', 'light dark'),
    metaTag('referrer', 'strict-origin-when-cross-origin'),
    metaTag('format-detection', 'telephone=no'),
    metaTag('framework', 'Nuxt'),
    metaTag('framework:version', '4'),
    metaTag('generator', 'VitePress'),
    metaTag('target', 'Nuxt developers, Vue developers, QA teams, product engineers'),
    metaTag('product:category', 'developer tools > bug reporting'),
    metaTag('product:tag', competitorTags),
    metaTag('product:tag', nuxtVueTags),
    linkTag('canonical', url),
    metaTag('og:title', title, 'property'),
    metaTag('og:description', description, 'property'),
    metaTag('og:type', 'website', 'property'),
    metaTag('og:url', url, 'property'),
    metaTag('og:site_name', SITE_NAME, 'property'),
    metaTag('og:locale', 'en_US', 'property'),
    metaTag('og:image', image, 'property'),
    metaTag('og:image:secure_url', image.replace(/^http:\/\//, 'https://'), 'property'),
    metaTag('og:image:alt', imageAlt, 'property'),
    metaTag('og:image:type', 'image/png', 'property'),
    metaTag('og:image:width', String(imageWidth), 'property'),
    metaTag('og:image:height', String(imageHeight), 'property'),
    metaTag('twitter:card', 'summary_large_image'),
    metaTag('twitter:title', title),
    metaTag('twitter:description', description),
    metaTag('twitter:image', image),
    metaTag('twitter:image:alt', imageAlt),
    metaTag('twitter:label1', 'Built for'),
    metaTag('twitter:data1', 'Nuxt & Vue 3'),
    metaTag('twitter:label2', 'Alternative to'),
    metaTag('twitter:data2', 'Ybug, Jam.dev, Marker.io, BugHerd, and similar tools'),
    ...buildStructuredData(pageData, url, description),
  ]
}

export function applyPageSeo(pageData: PageData, _ctx?: unknown): void {
  pageData.frontmatter.head ??= []
  const head = pageData.frontmatter.head as HeadConfig[]
  head.push(...buildSocialHead(pageData))
}
