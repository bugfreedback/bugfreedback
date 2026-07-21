import { defineConfig } from 'vitepress'
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  applyPageSeo,
} from './seo'

export default defineConfig({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  base: '/bugfreedback/',
  lang: 'en-US',
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', href: `${SITE_URL}hero-launcher.png`, type: 'image/png' }],
  ],
  sitemap: {
    hostname: SITE_URL.replace(/\/$/, ''),
  },
  transformPageData(pageData, ctx) {
    applyPageSeo(pageData, ctx)
  },
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'About', link: '/about' },
      { text: 'Demo', link: '/guide/demo' },
      { text: 'Adapters', link: '/guide/adapters' },
      { text: 'GitHub', link: 'https://github.com/bugfreedback/bugfreedback' },
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'About', link: '/about' },
          { text: 'Configuration', link: '/guide/configuration' },
          { text: 'Local demo', link: '/guide/demo' },
        ],
      },
      {
        text: 'Adapters',
        items: [
          { text: 'Overview', link: '/guide/adapters' },
          { text: 'Storage (GCS / S3)', link: '/guide/storage' },
        ],
      },
      {
        text: 'Export providers',
        collapsed: false,
        items: [
          { text: 'GitHub Issues', link: '/guide/export/github' },
          { text: 'Linear', link: '/guide/export/linear' },
          { text: 'Jira', link: '/guide/export/jira' },
          { text: 'Notion', link: '/guide/export/notion' },
          { text: 'Slack', link: '/guide/export/slack' },
          { text: 'Asana', link: '/guide/export/asana' },
          { text: 'Trello', link: '/guide/export/trello' },
          { text: 'Webhook', link: '/guide/export/webhook' },
          { text: 'IFTTT', link: '/guide/export/ifttt' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/bugfreedback/bugfreedback' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 bugfreedback',
    },
  },
})
